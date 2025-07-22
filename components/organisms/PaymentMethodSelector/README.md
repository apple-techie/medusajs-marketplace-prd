# PaymentMethodSelector Component

A comprehensive payment method selection organism for e-commerce checkout. Supports multiple payment types including credit/debit cards, digital wallets, and alternative payment methods with built-in card input validation.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { PaymentMethodSelector } from '@/components/organisms/PaymentMethodSelector';

// Basic usage
<PaymentMethodSelector
  savedMethods={userPaymentMethods}
  selectedMethodId={selectedMethod}
  onSelect={(methodId) => {
    setSelectedMethod(methodId);
  }}
/>

// With new card option
<PaymentMethodSelector
  savedMethods={savedCards}
  allowNewCard
  showSaveOption
  onSelect={handleMethodSelect}
  onSaveCard={handleSaveCard}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `savedMethods` | `PaymentMethod[]` | `[]` | User's saved payment methods |
| `selectedMethodId` | `string` | - | Currently selected method ID |
| `acceptedTypes` | `PaymentMethod['type'][]` | `['card', 'paypal', 'apple-pay', 'google-pay']` | Accepted payment types |
| `allowNewCard` | `boolean` | `true` | Allow adding new card |
| `requireCVV` | `boolean` | `true` | Require CVV for saved cards |
| `walletBalance` | `number` | `0` | User's wallet balance |
| `walletCurrency` | `string` | `'USD'` | Wallet currency |
| `validateCard` | `(card) => errors` | - | Custom card validation |
| `onSelect` | `(methodId) => void` | - | **Required**. Selection handler |
| `onSaveCard` | `(save) => void` | - | Save card preference handler |
| `onCardInputChange` | `(data) => void` | - | Card input change handler |
| `layout` | `'list' \| 'grid' \| 'compact'` | `'list'` | Layout style |
| `showSaveOption` | `boolean` | `true` | Show save card checkbox |
| `showSetDefault` | `boolean` | `false` | Show set as default option |
| `groupByType` | `boolean` | `false` | Group methods by type |
| `loading` | `boolean` | `false` | Loading state |
| `processingMethodId` | `string` | - | Processing method ID |
| `title` | `string` | `'Payment Method'` | Section title |
| `newCardLabel` | `string` | `'Add new card'` | New card option label |
| `savedCardsLabel` | `string` | `'Saved Cards'` | Saved cards section label |
| `otherMethodsLabel` | `string` | `'Other Payment Methods'` | Other methods label |
| `className` | `string` | - | Container CSS classes |
| `methodClassName` | `string` | - | Method option CSS classes |

### PaymentMethod Type

```tsx
interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple-pay' | 'google-pay' | 'bank' | 'wallet';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  email?: string;
  bankName?: string;
  accountLast4?: string;
  walletBalance?: number;
  isDefault?: boolean;
  isExpired?: boolean;
}
```

## Common Patterns

### Basic Card Selection

```tsx
const savedCards: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
    holderName: 'John Doe',
    isDefault: true
  }
];

<PaymentMethodSelector
  savedMethods={savedCards}
  selectedMethodId={selectedCard}
  onSelect={setSelectedCard}
/>
```

### With Multiple Payment Types

```tsx
<PaymentMethodSelector
  savedMethods={allPaymentMethods}
  acceptedTypes={['card', 'paypal', 'apple-pay', 'google-pay', 'wallet']}
  walletBalance={150.00}
  selectedMethodId={selectedMethod}
  onSelect={handlePaymentSelect}
/>
```

### New Card Input

```tsx
<PaymentMethodSelector
  savedMethods={savedCards}
  allowNewCard
  showSaveOption
  onSelect={(methodId) => {
    if (methodId === 'new') {
      // Handle new card
    } else {
      // Handle saved method
    }
  }}
  onSaveCard={(save) => {
    setShouldSaveCard(save);
  }}
  onCardInputChange={(cardData) => {
    // Validate in real-time
    validateCardNumber(cardData.number);
  }}
/>
```

### With CVV Requirement

```tsx
<PaymentMethodSelector
  savedMethods={savedCards}
  selectedMethodId={selectedCard}
  requireCVV
  onSelect={(methodId) => {
    // CVV will be required for card selection
    setSelectedCard(methodId);
  }}
/>
```

### Custom Card Validation

```tsx
const validateCard = (cardData: any) => {
  const errors: Record<string, string> = {};
  
  // Custom validation rules
  if (cardData.number && !cardData.number.startsWith('4')) {
    errors.number = 'Only Visa cards accepted';
  }
  
  if (cardData.cvv && cardData.cvv.length !== 3) {
    errors.cvv = 'CVV must be 3 digits';
  }
  
  const expiryDate = new Date(cardData.expiryYear, cardData.expiryMonth - 1);
  if (expiryDate < new Date()) {
    errors.expiry = 'Card has expired';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

<PaymentMethodSelector
  savedMethods={[]}
  allowNewCard
  validateCard={validateCard}
  onSelect={handleSelect}
/>
```

## Checkout Integration

```tsx
function CheckoutPayment() {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveCard, setSaveCard] = useState(true);
  
  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    try {
      if (selectedMethod === 'new' && saveCard) {
        // Save new card first
        await savePaymentMethod(cardData);
      }
      
      // Process payment
      await processPayment({
        methodId: selectedMethod,
        amount: orderTotal,
        cvv: cvvValue
      });
      
      // Success
      navigateToSuccess();
    } catch (error) {
      showError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <PaymentMethodSelector
        savedMethods={userPaymentMethods}
        selectedMethodId={selectedMethod}
        processingMethodId={isProcessing ? selectedMethod : undefined}
        allowNewCard
        requireCVV
        showSaveOption
        acceptedTypes={['card', 'paypal', 'apple-pay']}
        onSelect={setSelectedMethod}
        onSaveCard={setSaveCard}
      />
      
      <Button
        onClick={handlePayment}
        disabled={!selectedMethod || isProcessing}
        loading={isProcessing}
      >
        Pay {formatCurrency(orderTotal)}
      </Button>
    </>
  );
}
```

## Wallet Integration

```tsx
<PaymentMethodSelector
  savedMethods={savedMethods}
  acceptedTypes={['card', 'wallet']}
  walletBalance={walletBalance}
  walletCurrency="USD"
  onSelect={(methodId) => {
    if (methodId === 'wallet') {
      // Check if wallet has sufficient balance
      if (walletBalance >= orderTotal) {
        setSelectedMethod('wallet');
      } else {
        showError('Insufficient wallet balance');
      }
    } else {
      setSelectedMethod(methodId);
    }
  }}
/>
```

## Digital Wallets

```tsx
// With all digital wallet options
<PaymentMethodSelector
  savedMethods={[]}
  acceptedTypes={['card', 'paypal', 'apple-pay', 'google-pay']}
  onSelect={async (methodId) => {
    switch (methodId) {
      case 'paypal':
        await initiatePayPalCheckout();
        break;
      case 'apple-pay':
        await initiateApplePay();
        break;
      case 'google-pay':
        await initiateGooglePay();
        break;
      default:
        setSelectedMethod(methodId);
    }
  }}
/>
```

## Expired Card Handling

```tsx
const methods = savedMethods.map(method => ({
  ...method,
  isExpired: isCardExpired(method.expiryMonth, method.expiryYear)
}));

<PaymentMethodSelector
  savedMethods={methods}
  onSelect={(methodId) => {
    const method = methods.find(m => m.id === methodId);
    if (method?.isExpired) {
      showError('This card has expired. Please use a different payment method.');
    } else {
      setSelectedMethod(methodId);
    }
  }}
/>
```

## Loading States

```tsx
// Show loading while fetching payment methods
{isLoadingMethods ? (
  <PaymentMethodSelector
    loading
    onSelect={() => {}}
  />
) : (
  <PaymentMethodSelector
    savedMethods={paymentMethods}
    selectedMethodId={selectedMethod}
    processingMethodId={processingId}
    onSelect={handleSelect}
  />
)}
```

## Accessibility

- Radio button pattern for method selection
- Keyboard navigation support
- Screen reader labels for all payment methods
- Form validation with error messages
- Loading state announcements
- Focus management

## Best Practices

1. **Security**: Never store full card numbers, only last 4 digits
2. **Validation**: Implement robust card validation on both client and server
3. **CVV**: Always require CVV for card payments
4. **Expiry**: Check and indicate expired cards
5. **Default**: Allow users to set a default payment method
6. **Loading**: Show loading states during payment processing
7. **Errors**: Provide clear error messages for validation failures
8. **PCI Compliance**: Use tokenization for card data handling