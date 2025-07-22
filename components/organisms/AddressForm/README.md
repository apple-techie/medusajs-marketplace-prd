# AddressForm Component

A comprehensive address form organism for e-commerce checkout flows. Supports shipping and billing addresses with built-in validation, address verification, and dynamic state/province loading.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { AddressForm } from '@/components/organisms/AddressForm';

// Basic usage
<AddressForm
  type="shipping"
  onSubmit={(address) => {
    console.log('Address submitted:', address);
  }}
/>

// With existing address
<AddressForm
  address={{
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US'
  }}
  onSubmit={handleAddressSubmit}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `address` | `Partial<Address>` | - | Initial address values |
| `type` | `'shipping' \| 'billing' \| 'both'` | `'shipping'` | Address type |
| `showCompany` | `boolean` | `true` | Show company field |
| `showPhone` | `boolean` | `true` | Show phone field |
| `showEmail` | `boolean` | `false` | Show email field |
| `showSetDefault` | `boolean` | `false` | Show set as default checkbox |
| `countries` | `Array<{code, name}>` | US, CA, GB | Available countries |
| `states` | `Array<{code, name}>` | `[]` | Initial states/provinces |
| `loadStates` | `(country) => Promise<states>` | - | Dynamic state loader |
| `required` | `Array<keyof Address>` | Common fields | Required fields |
| `validate` | `(address) => errors` | - | Custom validation |
| `verifyAddress` | `boolean` | `false` | Enable address verification |
| `onVerifyAddress` | `(address) => Promise<result>` | - | Address verification handler |
| `onSubmit` | `(address) => void` | - | **Required**. Submit handler |
| `onCancel` | `() => void` | - | Cancel handler |
| `layout` | `'single' \| 'double'` | `'double'` | Form layout |
| `compact` | `boolean` | `false` | Compact mode |
| `disabled` | `boolean` | `false` | Disable all fields |
| `loading` | `boolean` | `false` | Loading state |
| `title` | `string` | - | Form title |
| `submitLabel` | `string` | `'Save Address'` | Submit button label |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label |
| `verifyLabel` | `string` | `'Verify Address'` | Verify button label |
| `className` | `string` | - | Container CSS classes |
| `fieldClassName` | `string` | - | Field wrapper CSS classes |

### Address Type

```tsx
interface Address {
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
```

## Common Patterns

### Shipping Address

```tsx
<AddressForm
  type="shipping"
  title="Shipping Address"
  showPhone
  onSubmit={async (address) => {
    await saveShippingAddress(address);
    navigateToNextStep();
  }}
/>
```

### Billing Address

```tsx
<AddressForm
  type="billing"
  title="Billing Address"
  showEmail
  onSubmit={async (address) => {
    await saveBillingAddress(address);
  }}
/>
```

### With Address Verification

```tsx
<AddressForm
  verifyAddress
  onVerifyAddress={async (address) => {
    const result = await verifyWithUSPS(address);
    return {
      valid: result.valid,
      suggestions: result.suggestions
    };
  }}
  onSubmit={handleVerifiedAddress}
/>
```

### Dynamic State Loading

```tsx
const loadStates = async (countryCode: string) => {
  const response = await fetch(`/api/states/${countryCode}`);
  return response.json();
};

<AddressForm
  countries={internationalCountries}
  loadStates={loadStates}
  onSubmit={handleSubmit}
/>
```

### Custom Validation

```tsx
<AddressForm
  validate={(address) => {
    const errors: Record<string, string> = {};
    
    if (address.firstName.length < 2) {
      errors.firstName = 'Name too short';
    }
    
    if (address.phone && !isValidPhone(address.phone)) {
      errors.phone = 'Invalid phone number';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }}
  onSubmit={handleSubmit}
/>
```

## Checkout Flow Example

```tsx
function CheckoutAddresses() {
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  
  return (
    <>
      {/* Step 1: Shipping */}
      {!shippingAddress && (
        <AddressForm
          type="shipping"
          title="Where should we ship your order?"
          showPhone
          onSubmit={(address) => {
            setShippingAddress(address);
          }}
        />
      )}
      
      {/* Step 2: Billing */}
      {shippingAddress && !billingAddress && (
        <>
          <Checkbox
            checked={sameAsShipping}
            onChange={setSameAsShipping}
            label="Same as shipping address"
          />
          
          {!sameAsShipping && (
            <AddressForm
              type="billing"
              title="Billing Address"
              showEmail
              onSubmit={(address) => {
                setBillingAddress(address);
              }}
              onCancel={() => setShippingAddress(null)}
            />
          )}
          
          {sameAsShipping && (
            <Button onClick={() => setBillingAddress(shippingAddress)}>
              Continue to Payment
            </Button>
          )}
        </>
      )}
    </>
  );
}
```

## Address Book Integration

```tsx
function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleSave = async (address: Address) => {
    if (editingId) {
      await updateAddress(editingId, address);
    } else {
      await createAddress(address);
    }
    
    refreshAddresses();
    setEditingId(null);
  };
  
  return (
    <>
      {addresses.map(addr => (
        <AddressCard
          key={addr.id}
          address={addr}
          onEdit={() => setEditingId(addr.id)}
        />
      ))}
      
      {editingId && (
        <AddressForm
          address={addresses.find(a => a.id === editingId)}
          showSetDefault
          onSubmit={handleSave}
          onCancel={() => setEditingId(null)}
        />
      )}
    </>
  );
}
```

## International Support

```tsx
// With full country list
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  // ... more countries
];

// Dynamic state/province loading
const loadStates = async (countryCode: string) => {
  switch (countryCode) {
    case 'US':
      return usStates;
    case 'CA':
      return canadianProvinces;
    case 'AU':
      return australianStates;
    default:
      return [];
  }
};

<AddressForm
  countries={countries}
  loadStates={loadStates}
  onSubmit={handleInternationalAddress}
/>
```

## Layout Options

### Single Column
```tsx
<AddressForm
  layout="single"
  onSubmit={handleSubmit}
/>
```

### Compact Mode
```tsx
<AddressForm
  compact
  showCompany={false}
  showPhone={false}
  onSubmit={handleSubmit}
/>
```

## Validation

Built-in validation includes:
- Required field validation
- Email format validation
- Phone number format validation
- US ZIP code format (5 or 9 digits)
- Canadian postal code format
- Custom validation support

## Accessibility

- Form labels and error messages
- Required field indicators
- Keyboard navigation support
- Screen reader announcements
- Error focus management
- Loading state indicators

## Best Practices

1. **Required Fields**: Mark only essential fields as required
2. **Address Verification**: Implement for shipping addresses to reduce delivery issues
3. **State Loading**: Cache loaded states to reduce API calls
4. **Phone Numbers**: Include country code for international support
5. **Default Address**: Allow users to set a default for faster checkout
6. **Validation**: Provide clear, specific error messages
7. **Mobile**: Test form on mobile devices for usability
8. **International**: Support international addresses when needed