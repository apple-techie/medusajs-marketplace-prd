# Age Verification System Specifications

## Table of Contents
1. [Overview](#overview)
2. [Verification Methods](#verification-methods)
3. [Admin Configuration](#admin-configuration)
4. [Frontend Implementation](#frontend-implementation)
5. [Backend Architecture](#backend-architecture)
6. [Compliance Requirements](#compliance-requirements)
7. [Session Management](#session-management)
8. [Implementation Details](#implementation-details)

---

## 1. Overview

The age verification system ensures compliance with age-restricted product regulations while maintaining a smooth user experience. The system is configurable per category and supports multiple verification methods.

### Key Features
- Multiple verification methods (birthdate, checkbox, ID verification)
- Admin-configurable age requirements
- Session persistence with configurable duration
- Geographic-specific rules
- Compliance logging and audit trails
- Integration with existing authentication

### Business Requirements
- Support different age requirements (18+, 21+)
- Enable/disable per category or globally
- Track verification attempts for compliance
- Support for different regions with varying laws
- Bypass options for authenticated users

---

## 2. Verification Methods

### 2.1 Birth Date Entry

```tsx
// components/age-gate/birthdate-verification.tsx
export function BirthdateVerification({ 
  ageRequirement, 
  onVerify 
}: VerificationProps) {
  const [birthDate, setBirthDate] = useState<Date>();
  const [error, setError] = useState<string>();
  
  const calculateAge = (date: Date): number => {
    const today = new Date();
    const birthYear = date.getFullYear();
    const birthMonth = date.getMonth();
    const birthDay = date.getDate();
    
    let age = today.getFullYear() - birthYear;
    
    if (today.getMonth() < birthMonth || 
        (today.getMonth() === birthMonth && today.getDate() < birthDay)) {
      age--;
    }
    
    return age;
  };
  
  const handleSubmit = () => {
    if (!birthDate) {
      setError('Please enter your date of birth');
      return;
    }
    
    const age = calculateAge(birthDate);
    if (age < ageRequirement) {
      setError(`You must be at least ${ageRequirement} years old`);
      return;
    }
    
    onVerify({ 
      method: 'birthdate', 
      birthDate, 
      age 
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Enter your date of birth
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="MM"
            min="1"
            max="12"
            className="w-20 px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="DD"
            min="1"
            max="31"
            className="w-20 px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="YYYY"
            min="1900"
            max={new Date().getFullYear()}
            className="w-24 px-3 py-2 border rounded"
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <Button 
        onClick={handleSubmit}
        disabled={!birthDate || (birthDate && calculateAge(birthDate) < ageRequirement)}
      >
        Verify Age
      </Button>
    </div>
  );
}
```

### 2.2 Checkbox Confirmation

```tsx
// components/age-gate/checkbox-verification.tsx
export function CheckboxVerification({ 
  ageRequirement, 
  onVerify 
}: VerificationProps) {
  const [agreed, setAgreed] = useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Checkbox
          id="age-confirm"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(!!checked)}
        />
        <label
          htmlFor="age-confirm"
          className="text-sm leading-relaxed cursor-pointer"
        >
          I confirm that I am {ageRequirement} years of age or older
          and agree to the terms of use.
        </label>
      </div>
      
      <Button 
        onClick={() => onVerify({ method: 'checkbox', confirmed: true })}
        disabled={!agreed}
      >
        Enter Site
      </Button>
    </div>
  );
}
```

### 2.3 ID Verification Integration

```typescript
// services/id-verification.service.ts
export class IDVerificationService {
  private provider: IDVerificationProvider;
  
  async initiateVerification(userId: string): Promise<VerificationSession> {
    const session = await this.provider.createSession({
      userId,
      requiredDocuments: ['drivers_license', 'passport', 'id_card'],
      verificationTypes: ['age', 'identity'],
      webhookUrl: `${process.env.API_URL}/webhooks/id-verification`,
    });
    
    return {
      sessionId: session.id,
      verificationUrl: session.url,
      expiresAt: session.expiresAt,
    };
  }
  
  async handleVerificationComplete(sessionId: string): Promise<VerificationResult> {
    const result = await this.provider.getSessionResult(sessionId);
    
    if (result.status === 'verified') {
      const age = this.extractAge(result.documentData);
      
      await this.saveVerificationResult({
        userId: result.userId,
        sessionId,
        age,
        documentType: result.documentType,
        verifiedAt: new Date(),
      });
      
      return {
        verified: true,
        age,
        documentType: result.documentType,
      };
    }
    
    return {
      verified: false,
      reason: result.failureReason,
    };
  }
}
```

---

## 3. Admin Configuration

### 3.1 Global Settings Interface

```tsx
// app/admin/settings/age-gate/page.tsx
export function AgeGateSettings() {
  const { settings, updateSettings } = useAgeGateSettings();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Age Gate Configuration</CardTitle>
        <CardDescription>
          Configure age verification requirements for your marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Global Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Age Gate</Label>
              <p className="text-sm text-muted-foreground">
                Require age verification for accessing the marketplace
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) => updateSettings({ enabled })}
            />
          </div>

          {/* Default Age Requirement */}
          <div className="space-y-2">
            <Label>Default Age Requirement</Label>
            <RadioGroup 
              value={settings.defaultAgeRequirement.toString()}
              onValueChange={(value) => updateSettings({ 
                defaultAgeRequirement: parseInt(value) 
              })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="18" id="age-18" />
                <Label htmlFor="age-18">18+ years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="21" id="age-21" />
                <Label htmlFor="age-21">21+ years</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Verification Methods */}
          <VerificationMethodsConfig 
            methods={settings.verificationMethods}
            onChange={(methods) => updateSettings({ verificationMethods: methods })}
          />

          {/* Session Duration */}
          <div className="space-y-2">
            <Label>Session Duration</Label>
            <Select 
              value={settings.sessionDuration.toString()}
              onValueChange={(value) => updateSettings({ 
                sessionDuration: parseInt(value) 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="168">7 days</SelectItem>
                <SelectItem value="720">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category-Specific Settings */}
          <CategoryAgeRequirements />

          {/* Geographic Restrictions */}
          <GeographicRestrictions />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Settings</Button>
      </CardFooter>
    </Card>
  );
}
```

### 3.2 Category-Specific Configuration

```tsx
// components/admin/category-age-requirements.tsx
export function CategoryAgeRequirements() {
  const { categories, updateCategory } = useCategorySettings();
  
  return (
    <div className="space-y-2">
      <Label>Category-Specific Requirements</Label>
      <div className="border rounded-lg p-4 space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={category.icon}
                alt={category.name}
                className="h-6 w-6"
              />
              <span className="font-medium">{category.name}</span>
            </div>
            <Select
              value={category.ageRequirement?.toString() || 'inherit'}
              onValueChange={(value) => updateCategory(category.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">Use Default</SelectItem>
                <SelectItem value="none">No Restriction</SelectItem>
                <SelectItem value="18">18+</SelectItem>
                <SelectItem value="21">21+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. Frontend Implementation

### 4.1 Age Gate Modal

```tsx
// components/age-gate/age-gate-modal.tsx
export function AgeGateModal() {
  const { 
    isRequired, 
    settings, 
    verifyAge, 
    isVerified,
    loading 
  } = useAgeGate();
  
  if (!isRequired || isVerified) {
    return null;
  }
  
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Age Verification Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">
              You must be {settings.ageRequirement}+ to enter
            </p>
            <p className="text-sm text-muted-foreground">
              Please verify your age to continue
            </p>
          </div>
          
          {settings.verificationMethod === 'birthdate' && (
            <BirthdateVerification
              ageRequirement={settings.ageRequirement}
              onVerify={verifyAge}
            />
          )}
          
          {settings.verificationMethod === 'checkbox' && (
            <CheckboxVerification
              ageRequirement={settings.ageRequirement}
              onVerify={verifyAge}
            />
          )}
          
          {settings.verificationMethod === 'id_verification' && (
            <IDVerificationFlow
              onComplete={verifyAge}
            />
          )}
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.location.href = 'https://google.com'}
            >
              Exit
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            By entering this site, you agree to our Terms of Service and Privacy Policy.
            We use cookies to verify your age for this session.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 4.2 Age Gate Hook

```typescript
// hooks/use-age-gate.ts
export function useAgeGate() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<AgeGateSettings>();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAgeVerification();
  }, []);
  
  const checkAgeVerification = async () => {
    try {
      // Get age gate settings
      const settingsRes = await fetch('/api/age-gate/settings');
      const settings = await settingsRes.json();
      setSettings(settings);
      
      if (!settings.enabled) {
        setIsVerified(true);
        setLoading(false);
        return;
      }
      
      // Check if user is authenticated and that's sufficient
      if (isAuthenticated && !settings.requireAuthenticated) {
        setIsVerified(true);
        setLoading(false);
        return;
      }
      
      // Check session storage for verification
      const verified = sessionStorage.getItem('age_verified');
      const verifiedTime = sessionStorage.getItem('age_verified_time');
      
      if (verified && verifiedTime) {
        const timeDiff = Date.now() - parseInt(verifiedTime);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < settings.sessionDuration) {
          setIsVerified(true);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to check age verification:', error);
      setLoading(false);
    }
  };
  
  const verifyAge = async (data: any) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/age-gate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Verification failed');
      }
      
      const result = await response.json();
      
      if (result.verified) {
        sessionStorage.setItem('age_verified', 'true');
        sessionStorage.setItem('age_verified_time', Date.now().toString());
        setIsVerified(true);
      } else {
        throw new Error('Age requirement not met');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    isRequired: settings?.enabled && !isVerified,
    settings,
    isVerified,
    loading,
    verifyAge,
  };
}
```

---

## 5. Backend Architecture

### 5.1 MedusaJS Module

```typescript
// modules/age-gate/index.ts
import { Module } from '@medusajs/modules-sdk';
import { AgeGateService } from './services/age-gate-service';
import { AgeGateSettings } from './models/age-gate-settings';
import { AgeVerificationLog } from './models/age-verification-log';

export default Module({
  service: AgeGateService,
  models: [AgeGateSettings, AgeVerificationLog],
  migrations: [
    {
      name: 'CreateAgeGateTables',
      up: async (queryInterface, Sequelize) => {
        // Create tables
      },
    },
  ],
});
```

### 5.2 Age Gate Service

```typescript
// modules/age-gate/services/age-gate-service.ts
export class AgeGateService extends TransactionBaseService {
  async getSettings(): Promise<AgeGateSettings> {
    const settings = await this.manager.findOne(AgeGateSettings, {
      where: { id: 'default' },
    });
    
    if (!settings) {
      return this.getDefaultSettings();
    }
    
    return settings;
  }
  
  async verifyAge(data: {
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    userId?: string;
    method: string;
    birthDate?: Date;
    confirmed?: boolean;
    geoLocation?: any;
  }): Promise<{ verified: boolean; reason?: string }> {
    const settings = await this.getSettings();
    
    if (!settings.enabled) {
      return { verified: true };
    }
    
    let verified = false;
    let ageProvided: number | undefined;
    let reason: string | undefined;
    
    // Check verification based on method
    if (data.method === 'birthdate' && data.birthDate) {
      const age = this.calculateAge(data.birthDate);
      ageProvided = age;
      
      // Check geo-specific requirements
      const geoRequirement = this.getGeoRequirement(settings, data.geoLocation);
      const requiredAge = geoRequirement || settings.defaultAgeRequirement;
      
      verified = age >= requiredAge;
      if (!verified) {
        reason = `Must be at least ${requiredAge} years old`;
      }
    } else if (data.method === 'checkbox' && data.confirmed) {
      verified = true;
    }
    
    // Log verification attempt
    await this.logVerification({
      ...data,
      verified,
      ageProvided,
    });
    
    return { verified, reason };
  }
  
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
```

---

## 6. Compliance Requirements

### 6.1 Data Retention

```typescript
interface ComplianceConfig {
  // Verification log retention period
  logRetentionDays: 365;
  
  // Required data points for compliance
  requiredDataPoints: {
    ipAddress: boolean;
    userAgent: boolean;
    timestamp: boolean;
    verificationMethod: boolean;
    geoLocation: boolean;
  };
  
  // Audit requirements
  auditRequirements: {
    logAllAttempts: boolean;
    logFailedAttempts: boolean;
    includeSessionData: boolean;
  };
}
```

### 6.2 Compliance Reporting

```typescript
// services/compliance-reporting.service.ts
export class ComplianceReportingService {
  async generateComplianceReport(
    startDate: Date,
    endDate: Date
  ): Promise<ComplianceReport> {
    const verificationLogs = await this.getVerificationLogs(startDate, endDate);
    
    return {
      period: { startDate, endDate },
      totalAttempts: verificationLogs.length,
      successfulVerifications: verificationLogs.filter(l => l.verified).length,
      failedVerifications: verificationLogs.filter(l => !l.verified).length,
      verificationMethods: this.groupByMethod(verificationLogs),
      geographicBreakdown: this.groupByLocation(verificationLogs),
      ageDistribution: this.calculateAgeDistribution(verificationLogs),
      complianceRate: this.calculateComplianceRate(verificationLogs),
    };
  }
}
```

---

## 7. Session Management

### 7.1 Session Storage

```typescript
// services/age-verification-session.service.ts
export class AgeVerificationSessionService {
  async createSession(
    sessionId: string,
    verified: boolean,
    duration: number
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + duration);
    
    await this.redis.setex(
      `age_verification:${sessionId}`,
      duration * 3600,
      JSON.stringify({
        verified,
        createdAt: new Date(),
        expiresAt,
      })
    );
  }
  
  async checkSession(sessionId: string): Promise<boolean> {
    const session = await this.redis.get(`age_verification:${sessionId}`);
    
    if (!session) {
      return false;
    }
    
    const data = JSON.parse(session);
    return data.verified && new Date(data.expiresAt) > new Date();
  }
}
```

### 7.2 Cookie Management

```typescript
// utils/age-verification-cookies.ts
export const AgeVerificationCookies = {
  set(verified: boolean, duration: number) {
    const expires = new Date();
    expires.setHours(expires.getHours() + duration);
    
    document.cookie = `age_verified=${verified}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
    document.cookie = `age_verified_time=${Date.now()}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
  },
  
  get(): { verified: boolean; timestamp: number } | null {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    if (cookies.age_verified && cookies.age_verified_time) {
      return {
        verified: cookies.age_verified === 'true',
        timestamp: parseInt(cookies.age_verified_time),
      };
    }
    
    return null;
  },
  
  clear() {
    document.cookie = 'age_verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'age_verified_time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },
};
```

---

## 8. Implementation Details

### 8.1 Database Schema

```sql
-- Age gate settings
CREATE TABLE age_gate_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  enabled BOOLEAN DEFAULT FALSE,
  default_age_requirement INTEGER DEFAULT 21,
  verification_methods JSONB DEFAULT '[]',
  session_duration INTEGER DEFAULT 24,
  require_authenticated_users BOOLEAN DEFAULT FALSE,
  geo_restrictions JSONB DEFAULT '[]',
  compliance_mode VARCHAR(20) DEFAULT 'standard',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Age verification logs
CREATE TABLE age_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  verification_method VARCHAR(50) NOT NULL,
  verification_data JSONB,
  verified BOOLEAN NOT NULL,
  age_provided INTEGER,
  geo_location JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_verification_session (session_id),
  INDEX idx_verification_user (user_id),
  INDEX idx_verification_created (created_at)
);

-- Category age requirements
CREATE TABLE category_age_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES product_categories(id),
  age_requirement INTEGER,
  verification_method_override VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id)
);
```

### 8.2 API Endpoints

```typescript
// Age gate settings
GET /api/age-gate/settings
GET /api/admin/age-gate/settings
PUT /api/admin/age-gate/settings

// Age verification
POST /api/age-gate/verify
{
  "method": "birthdate",
  "birthDate": "2000-01-15",
  "sessionId": "sess_123",
  "geoLocation": {
    "country": "US",
    "state": "CA"
  }
}

// Category settings
GET /api/admin/age-gate/categories
PUT /api/admin/age-gate/categories/:categoryId

// Compliance reports
GET /api/admin/age-gate/compliance-report
?startDate=2025-01-01
&endDate=2025-01-31
```

### 8.3 Testing Strategy

```typescript
describe('AgeGateService', () => {
  it('should verify age correctly for birthdate method', async () => {
    const result = await service.verifyAge({
      method: 'birthdate',
      birthDate: new Date('2000-01-01'),
      sessionId: 'test_session',
      ipAddress: '127.0.0.1',
      userAgent: 'test',
    });
    
    expect(result.verified).toBe(true);
  });
  
  it('should reject underage users', async () => {
    const result = await service.verifyAge({
      method: 'birthdate',
      birthDate: new Date('2010-01-01'),
      sessionId: 'test_session',
      ipAddress: '127.0.0.1',
      userAgent: 'test',
    });
    
    expect(result.verified).toBe(false);
    expect(result.reason).toContain('Must be at least');
  });
});
```

---

## Summary

The age verification system provides:

1. **Multiple verification methods** to suit different compliance requirements
2. **Flexible configuration** at global and category levels
3. **Session management** with configurable duration
4. **Geographic restrictions** for region-specific requirements
5. **Comprehensive logging** for compliance audits
6. **Seamless integration** with the existing authentication system

The system ensures regulatory compliance while minimizing friction for legitimate users.
