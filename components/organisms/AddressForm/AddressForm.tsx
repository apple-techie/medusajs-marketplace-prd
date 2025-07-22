import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Button } from '../../atoms/Button/Button';

export interface Address {
  id?: string;
  type?: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  isDefault?: boolean;
}

export interface AddressFormProps {
  // Initial values
  address?: Partial<Address>;
  
  // Form options
  type?: 'shipping' | 'billing' | 'both';
  showCompany?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showSetDefault?: boolean;
  
  // Countries and states
  countries?: Array<{ code: string; name: string }>;
  states?: Array<{ code: string; name: string }>;
  loadStates?: (countryCode: string) => Promise<Array<{ code: string; name: string }>>;
  
  // Validation
  required?: Array<keyof Address>;
  validate?: (address: Address) => Record<string, string> | null;
  
  // Address verification
  verifyAddress?: boolean;
  onVerifyAddress?: (address: Address) => Promise<{ valid: boolean; suggestions?: Address[] }>;
  
  // Submission
  onSubmit: (address: Address) => void | Promise<void>;
  onCancel?: () => void;
  
  // UI options
  layout?: 'single' | 'double';
  compact?: boolean;
  disabled?: boolean;
  loading?: boolean;
  
  // Labels
  title?: string;
  submitLabel?: string;
  cancelLabel?: string;
  verifyLabel?: string;
  
  // Styling
  className?: string;
  fieldClassName?: string;
  
  'aria-label'?: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  type = 'shipping',
  showCompany = true,
  showPhone = true,
  showEmail = false,
  showSetDefault = false,
  countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
  ],
  states: initialStates = [],
  loadStates,
  required = ['firstName', 'lastName', 'addressLine1', 'city', 'state', 'postalCode', 'country'],
  validate,
  verifyAddress = false,
  onVerifyAddress,
  onSubmit,
  onCancel,
  layout = 'double',
  compact = false,
  disabled = false,
  loading = false,
  title,
  submitLabel = 'Save Address',
  cancelLabel = 'Cancel',
  verifyLabel = 'Verify Address',
  className,
  fieldClassName,
  'aria-label': ariaLabel,
}) => {
  const [formData, setFormData] = useState<Address>({
    type: type === 'both' ? 'shipping' : type,
    firstName: '',
    lastName: '',
    company: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: countries[0]?.code || '',
    phone: '',
    email: '',
    isDefault: false,
    ...address,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [states, setStates] = useState(initialStates);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    suggestions?: Address[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load states when country changes
  useEffect(() => {
    if (loadStates && formData.country) {
      setIsLoadingStates(true);
      loadStates(formData.country)
        .then(newStates => {
          setStates(newStates);
          // Reset state if not in new list
          if (!newStates.find(s => s.code === formData.state)) {
            setFormData(prev => ({ ...prev, state: '' }));
          }
        })
        .finally(() => setIsLoadingStates(false));
    }
  }, [formData.country, loadStates]);

  // Handle field changes
  const handleChange = (field: keyof Address, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    required.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Phone validation (basic)
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    // Postal code validation (US/CA)
    if (formData.postalCode) {
      if (formData.country === 'US' && !/^\d{5}(-\d{4})?$/.test(formData.postalCode)) {
        newErrors.postalCode = 'Invalid ZIP code';
      } else if (formData.country === 'CA' && !/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(formData.postalCode)) {
        newErrors.postalCode = 'Invalid postal code';
      }
    }

    // Custom validation
    if (validate) {
      const customErrors = validate(formData);
      if (customErrors) {
        Object.assign(newErrors, customErrors);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle address verification
  const handleVerify = async () => {
    if (!validateForm() || !onVerifyAddress) return;

    setIsVerifying(true);
    try {
      const result = await onVerifyAddress(formData);
      setVerificationResult(result);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (verifyAddress && !verificationResult?.valid && onVerifyAddress) {
      await handleVerify();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use suggested address
  const useSuggestion = (suggestion: Address) => {
    setFormData(suggestion);
    setVerificationResult(null);
  };

  // Field wrapper for consistent layout
  const FieldWrapper: React.FC<{ 
    children: React.ReactNode; 
    span?: 'full' | 'half';
  }> = ({ children, span = 'half' }) => (
    <div className={cn(
      layout === 'double' && span === 'half' ? 'sm:col-span-1' : 'sm:col-span-2',
      fieldClassName
    )}>
      {children}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
      aria-label={ariaLabel || `${type} address form`}
    >
      {title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}

      <div className={cn(
        'grid gap-4',
        layout === 'double' ? 'sm:grid-cols-2' : 'grid-cols-1'
      )}>
        {/* Name fields */}
        <FieldWrapper>
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            required={required.includes('firstName')}
            disabled={disabled || loading}
            placeholder="John"
          />
        </FieldWrapper>

        <FieldWrapper>
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={errors.lastName}
            required={required.includes('lastName')}
            disabled={disabled || loading}
            placeholder="Doe"
          />
        </FieldWrapper>

        {/* Company */}
        {showCompany && (
          <FieldWrapper span="full">
            <Input
              label="Company"
              value={formData.company || ''}
              onChange={(e) => handleChange('company', e.target.value)}
              error={errors.company}
              required={required.includes('company')}
              disabled={disabled || loading}
              placeholder="Optional"
            />
          </FieldWrapper>
        )}

        {/* Address lines */}
        <FieldWrapper span="full">
          <Input
            label="Address Line 1"
            value={formData.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
            error={errors.addressLine1}
            required={required.includes('addressLine1')}
            disabled={disabled || loading}
            placeholder="123 Main Street"
          />
        </FieldWrapper>

        <FieldWrapper span="full">
          <Input
            label="Address Line 2"
            value={formData.addressLine2 || ''}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
            error={errors.addressLine2}
            required={required.includes('addressLine2')}
            disabled={disabled || loading}
            placeholder="Apartment, suite, etc. (optional)"
          />
        </FieldWrapper>

        {/* City */}
        <FieldWrapper>
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            error={errors.city}
            required={required.includes('city')}
            disabled={disabled || loading}
            placeholder="New York"
          />
        </FieldWrapper>

        {/* State/Province */}
        <FieldWrapper>
          <Select
            label="State/Province"
            value={formData.state}
            onChange={(value) => handleChange('state', value)}
            options={states.map(s => ({ value: s.code, label: s.name }))}
            error={errors.state}
            required={required.includes('state')}
            disabled={disabled || loading || isLoadingStates}
            placeholder={isLoadingStates ? "Loading..." : "Select state"}
          />
        </FieldWrapper>

        {/* Postal code */}
        <FieldWrapper>
          <Input
            label="ZIP/Postal Code"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            error={errors.postalCode}
            required={required.includes('postalCode')}
            disabled={disabled || loading}
            placeholder={formData.country === 'CA' ? "A1A 1A1" : "12345"}
          />
        </FieldWrapper>

        {/* Country */}
        <FieldWrapper>
          <Select
            label="Country"
            value={formData.country}
            onChange={(value) => handleChange('country', value)}
            options={countries.map(c => ({ value: c.code, label: c.name }))}
            error={errors.country}
            required={required.includes('country')}
            disabled={disabled || loading}
          />
        </FieldWrapper>

        {/* Phone */}
        {showPhone && (
          <FieldWrapper>
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              required={required.includes('phone')}
              disabled={disabled || loading}
              placeholder="+1 (555) 123-4567"
            />
          </FieldWrapper>
        )}

        {/* Email */}
        {showEmail && (
          <FieldWrapper>
            <Input
              label="Email Address"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required={required.includes('email')}
              disabled={disabled || loading}
              placeholder="john@example.com"
            />
          </FieldWrapper>
        )}
      </div>

      {/* Set as default */}
      {showSetDefault && (
        <Checkbox
          checked={formData.isDefault || false}
          onChange={(checked) => handleChange('isDefault', checked)}
          label="Set as default address"
          disabled={disabled || loading}
        />
      )}

      {/* Verification result */}
      {verificationResult && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon icon="alert-triangle" className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                {verificationResult.valid ? 'Address verified' : 'Address verification failed'}
              </p>
              {verificationResult.suggestions && verificationResult.suggestions.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Suggested address{verificationResult.suggestions.length > 1 ? 'es' : ''}:
                  </p>
                  {verificationResult.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => useSuggestion(suggestion)}
                      className="block w-full text-left p-2 bg-white dark:bg-neutral-800 rounded border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-sm"
                    >
                      <div>{suggestion.addressLine1}</div>
                      {suggestion.addressLine2 && <div>{suggestion.addressLine2}</div>}
                      <div>
                        {suggestion.city}, {suggestion.state} {suggestion.postalCode}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading || isSubmitting || isVerifying}
          >
            {cancelLabel}
          </Button>
        )}
        
        {verifyAddress && onVerifyAddress && !verificationResult?.valid && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleVerify}
            disabled={disabled || loading || isVerifying || isSubmitting}
            loading={isVerifying}
          >
            <Icon icon="map-pin" size="sm" />
            {verifyLabel}
          </Button>
        )}
        
        <Button
          type="submit"
          disabled={disabled || loading || isVerifying || isSubmitting}
          loading={isSubmitting}
        >
          <Icon icon="save" size="sm" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

AddressForm.displayName = 'AddressForm';