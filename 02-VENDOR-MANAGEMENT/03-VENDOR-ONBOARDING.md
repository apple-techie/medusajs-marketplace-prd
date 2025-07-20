# Vendor Onboarding Process

## Overview

The vendor onboarding process is designed to streamline the addition of new shops, brands, and distributors to the marketplace while ensuring compliance, quality standards, and proper financial setup.

## Onboarding Workflows by Vendor Type

### Shop (Affiliate) Onboarding

#### 1. Application Process
```typescript
interface ShopApplication {
  // Business Information
  businessName: string;
  businessType: 'sole_proprietor' | 'llc' | 'corporation';
  ein?: string;
  
  // Contact Information
  ownerName: string;
  email: string;
  phone: string;
  
  // Marketing Channels
  marketingChannels: {
    website?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    other?: string[];
  };
  
  // Expected Volume
  expectedMonthlySales: number;
  currentAudience: number;
  
  // Agreement
  termsAccepted: boolean;
  commissionAgreementAccepted: boolean;
}
```

#### 2. Approval Workflow
1. **Automated Screening**
   - Email verification
   - Business name uniqueness check
   - Social media verification
   - Minimum audience requirements

2. **Manual Review**
   - Marketing channel quality assessment
   - Brand alignment check
   - Compliance verification

3. **Onboarding Steps**
   - Welcome email with portal access
   - Marketing materials access
   - Referral link generation
   - Commission tier assignment (Bronze)

### Brand Onboarding

#### 1. Application Requirements
```typescript
interface BrandApplication {
  // Company Information
  companyName: string;
  legalEntityType: string;
  ein: string;
  businessLicense: File;
  
  // Brand Information
  brandName: string;
  brandWebsite: string;
  yearEstablished: number;
  
  // Product Information
  productCategories: string[];
  skuCount: number;
  averageUnitPrice: number;
  
  // Compliance
  ageRestrictedProducts: boolean;
  complianceCertificates: File[];
  productLiabilityInsurance: File;
  
  // Operations
  warehouseLocations: Address[];
  fulfillmentCapabilities: string[];
  inventoryManagementSystem: string;
  
  // Financial
  expectedMonthlyVolume: number;
  currentDistributionChannels: string[];
  bankAccountVerification: File;
}
```

#### 2. Verification Process
1. **Document Verification**
   - Business license validation
   - Insurance verification
   - Compliance certificate review
   - Bank account verification

2. **Product Review**
   - Sample product evaluation
   - Pricing structure review
   - Inventory capacity verification

3. **Integration Setup**
   - API credentials generation
   - Product catalog import
   - Inventory sync configuration
   - Stripe Connect onboarding

### Distributor Onboarding

#### 1. Requirements
```typescript
interface DistributorApplication {
  // Business Information
  companyName: string;
  warehouseLocations: WarehouseInfo[];
  
  // Capabilities
  storageCapacity: number; // sq ft
  temperatureControlled: boolean;
  securityFeatures: string[];
  
  // Operations
  staffCount: number;
  operatingHours: Schedule;
  fulfillmentSLA: number; // hours
  shippingCarriers: string[];
  
  // Technology
  wms: string; // Warehouse Management System
  apiCapabilities: boolean;
  ediCapabilities: boolean;
  
  // Compliance
  licenses: File[];
  insurance: File[];
  certifications: string[];
}
```

#### 2. Facility Inspection
- Physical warehouse inspection
- Security assessment
- Technology integration testing
- Staff training verification

## Stripe Connect Integration

### Account Setup Flow

```typescript
// services/stripe-onboarding.service.ts
export class StripeOnboardingService {
  async createConnectedAccount(vendor: Vendor): Promise<ConnectedAccount> {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: vendor.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: vendor.businessType,
      business_profile: {
        mcc: this.getMccCode(vendor.type),
        name: vendor.businessName,
        url: vendor.website,
      },
      settings: {
        payouts: {
          schedule: this.getPayoutSchedule(vendor.type),
        },
      },
      metadata: {
        vendor_id: vendor.id,
        vendor_type: vendor.type,
        platform: 'medusajs_marketplace',
      },
    });
    
    return this.saveConnectedAccount(vendor.id, account);
  }
  
  private getPayoutSchedule(vendorType: string): PayoutSchedule {
    switch (vendorType) {
      case 'shop':
        return { interval: 'weekly', weekly_anchor: 'friday' };
      case 'brand':
        return { interval: 'manual' }; // Net 30 terms
      case 'distributor':
        return { interval: 'daily' };
      default:
        return { interval: 'manual' };
    }
  }
}
```

### Onboarding UI Flow

```tsx
// components/vendor/stripe-onboarding.tsx
export function StripeOnboardingFlow({ vendor }: { vendor: Vendor }) {
  const [accountLink, setAccountLink] = useState<string>();
  const [status, setStatus] = useState<OnboardingStatus>('pending');
  
  const startOnboarding = async () => {
    const link = await createAccountLink(vendor.id);
    setAccountLink(link.url);
    window.location.href = link.url;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Setup</CardTitle>
        <CardDescription>
          Complete your Stripe account setup to receive payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'pending' && (
          <div className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                You'll be redirected to Stripe to complete your account setup.
                This typically takes 5-10 minutes.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="font-medium">Required Information:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Business information and address</li>
                <li>Tax identification number</li>
                <li>Bank account for payouts</li>
                <li>Identity verification (ID or passport)</li>
              </ul>
            </div>
            
            <Button onClick={startOnboarding} className="w-full">
              Start Payment Setup
            </Button>
          </div>
        )}
        
        {status === 'completed' && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="text-lg font-medium">Payment setup complete!</p>
            <p className="text-sm text-muted-foreground">
              You can now receive payments through the marketplace.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

## Automated Onboarding Steps

### 1. Account Creation
```typescript
async function createVendorAccount(application: VendorApplication) {
  // Create user account
  const user = await userService.create({
    email: application.email,
    role: `vendor_${application.type}`,
    metadata: {
      vendor_type: application.type,
      onboarding_status: 'in_progress',
    },
  });
  
  // Create vendor profile
  const vendor = await vendorService.create({
    user_id: user.id,
    type: application.type,
    business_name: application.businessName,
    status: 'pending_verification',
    onboarding_checklist: generateChecklist(application.type),
  });
  
  // Send welcome email
  await emailService.sendVendorWelcome(vendor);
  
  return { user, vendor };
}
```

### 2. Document Collection
```typescript
interface OnboardingDocument {
  type: 'business_license' | 'insurance' | 'tax_form' | 'bank_verification';
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  file_url?: string;
  rejection_reason?: string;
  verified_at?: Date;
  verified_by?: string;
}

async function processDocument(
  vendorId: string,
  document: UploadedDocument
): Promise<DocumentVerification> {
  // Store document
  const stored = await documentStorage.upload(document);
  
  // Run automated checks
  const autoChecks = await runAutomatedVerification(document);
  
  if (autoChecks.requiresManualReview) {
    await queueForManualReview(vendorId, stored);
    return { status: 'pending_review' };
  }
  
  // Update vendor status
  await updateOnboardingProgress(vendorId, document.type);
  
  return { status: 'verified' };
}
```

### 3. Training and Resources

```tsx
// components/vendor/onboarding-resources.tsx
export function OnboardingResources({ vendorType }: { vendorType: string }) {
  const resources = getResourcesByType(vendorType);
  
  return (
    <div className="space-y-6">
      {/* Video Tutorials */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {resources.docs.map((doc) => (
              <DocumentLink key={doc.id} document={doc} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Support Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Support
            </Button>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Onboarding Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Onboarding Checklist

### Shop Onboarding Checklist
```typescript
const shopOnboardingChecklist = [
  {
    id: 'account_setup',
    title: 'Account Setup',
    tasks: [
      { id: 'email_verified', label: 'Verify email address', required: true },
      { id: 'profile_complete', label: 'Complete business profile', required: true },
      { id: 'tax_info', label: 'Provide tax information', required: true },
    ],
  },
  {
    id: 'payment_setup',
    title: 'Payment Setup',
    tasks: [
      { id: 'stripe_connected', label: 'Connect Stripe account', required: true },
      { id: 'bank_verified', label: 'Verify bank account', required: true },
      { id: 'payout_schedule', label: 'Review payout schedule', required: false },
    ],
  },
  {
    id: 'marketing_setup',
    title: 'Marketing Setup',
    tasks: [
      { id: 'referral_link', label: 'Generate first referral link', required: true },
      { id: 'marketing_materials', label: 'Download marketing materials', required: false },
      { id: 'social_connected', label: 'Connect social accounts', required: false },
    ],
  },
  {
    id: 'training',
    title: 'Training',
    tasks: [
      { id: 'watch_intro', label: 'Watch introduction video', required: true },
      { id: 'read_guidelines', label: 'Read marketing guidelines', required: true },
      { id: 'complete_quiz', label: 'Complete compliance quiz', required: true },
    ],
  },
];
```

### Brand Onboarding Checklist
```typescript
const brandOnboardingChecklist = [
  {
    id: 'verification',
    title: 'Business Verification',
    tasks: [
      { id: 'business_license', label: 'Upload business license', required: true },
      { id: 'ein_verified', label: 'Verify EIN', required: true },
      { id: 'insurance_docs', label: 'Upload insurance documents', required: true },
      { id: 'compliance_certs', label: 'Upload compliance certificates', required: true },
    ],
  },
  {
    id: 'product_setup',
    title: 'Product Setup',
    tasks: [
      { id: 'catalog_import', label: 'Import product catalog', required: true },
      { id: 'pricing_configured', label: 'Configure pricing rules', required: true },
      { id: 'images_uploaded', label: 'Upload product images', required: true },
      { id: 'inventory_synced', label: 'Sync inventory levels', required: true },
    ],
  },
  {
    id: 'integration',
    title: 'System Integration',
    tasks: [
      { id: 'api_credentials', label: 'Generate API credentials', required: true },
      { id: 'webhook_configured', label: 'Configure webhooks', required: true },
      { id: 'test_order', label: 'Process test order', required: true },
      { id: 'inventory_feed', label: 'Set up inventory feed', required: false },
    ],
  },
  {
    id: 'financial',
    title: 'Financial Setup',
    tasks: [
      { id: 'stripe_connected', label: 'Complete Stripe Connect', required: true },
      { id: 'tax_forms', label: 'Submit tax forms', required: true },
      { id: 'payment_terms', label: 'Accept payment terms', required: true },
      { id: 'fee_schedule', label: 'Review fee schedule', required: true },
    ],
  },
];
```

## Onboarding Timeline

### Typical Timeline by Vendor Type

| Vendor Type | Application Review | Document Verification | Technical Setup | Go Live |
|-------------|-------------------|---------------------|-----------------|---------|
| Shop        | 1-2 days          | Same day            | 1 day           | 3 days  |
| Brand       | 3-5 days          | 2-3 days            | 3-5 days        | 2 weeks |
| Distributor | 5-7 days          | 3-5 days            | 5-7 days        | 3 weeks |

## Post-Onboarding Support

### 30-Day Support Program
1. **Week 1**: Daily check-ins and support
2. **Week 2-3**: Bi-weekly performance reviews
3. **Week 4**: Monthly review and optimization recommendations

### Success Metrics
- **Shops**: First referral sale within 7 days
- **Brands**: 90% catalog activation rate
- **Distributors**: 95% order fulfillment rate

## Compliance Requirements

### Age-Restricted Products
Vendors selling age-restricted products must:
1. Acknowledge compliance requirements
2. Implement age verification on their channels
3. Agree to platform age-gate policies
4. Maintain proper licensing

### Data Security
All vendors must:
1. Complete security assessment questionnaire
2. Implement secure API practices
3. Maintain PCI compliance (if applicable)
4. Sign data processing agreement
