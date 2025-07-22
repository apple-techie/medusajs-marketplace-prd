import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';

export interface PaymentMethod {
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

export interface PaymentMethodSelectorProps {
  // Saved methods
  savedMethods?: PaymentMethod[];
  selectedMethodId?: string;
  
  // Available payment types
  acceptedTypes?: Array<PaymentMethod['type']>;
  
  // New card input
  allowNewCard?: boolean;
  requireCVV?: boolean;
  
  // Wallet options
  walletBalance?: number;
  walletCurrency?: string;
  
  // Validation
  validateCard?: (card: any) => Record<string, string> | null;
  
  // Handlers
  onSelect: (methodId: string | 'new') => void;
  onSaveCard?: (saveCard: boolean) => void;
  onCardInputChange?: (cardData: any) => void;
  
  // UI options
  layout?: 'list' | 'grid' | 'compact';
  showSaveOption?: boolean;
  showSetDefault?: boolean;
  groupByType?: boolean;
  
  // Loading states
  loading?: boolean;
  processingMethodId?: string;
  
  // Labels
  title?: string;
  newCardLabel?: string;
  savedCardsLabel?: string;
  otherMethodsLabel?: string;
  
  // Styling
  className?: string;
  methodClassName?: string;
  
  'aria-label'?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  savedMethods = [],
  selectedMethodId,
  acceptedTypes = ['card', 'paypal', 'apple-pay', 'google-pay'],
  allowNewCard = true,
  requireCVV = true,
  walletBalance = 0,
  walletCurrency = 'USD',
  validateCard,
  onSelect,
  onSaveCard,
  onCardInputChange,
  layout = 'list',
  showSaveOption = true,
  showSetDefault = false,
  groupByType = false,
  loading = false,
  processingMethodId,
  title = 'Payment Method',
  newCardLabel = 'Add new card',
  savedCardsLabel = 'Saved Cards',
  otherMethodsLabel = 'Other Payment Methods',
  className,
  methodClassName,
  'aria-label': ariaLabel,
}) => {
  const [showNewCard, setShowNewCard] = useState(selectedMethodId === 'new');
  const [saveCard, setSaveCard] = useState(true);
  const [cvv, setCvv] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // Group methods by type
  const groupedMethods = React.useMemo(() => {
    if (!groupByType) return { all: savedMethods };
    
    return savedMethods.reduce((acc, method) => {
      const key = method.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(method);
      return acc;
    }, {} as Record<string, PaymentMethod[]>);
  }, [savedMethods, groupByType]);

  // Get icon for payment type
  const getPaymentIcon = (type: PaymentMethod['type'], brand?: string) => {
    if (type === 'card' && brand) {
      const brandIcons: Record<string, string> = {
        visa: 'credit-card',
        mastercard: 'credit-card',
        amex: 'credit-card',
        discover: 'credit-card',
      };
      return brandIcons[brand.toLowerCase()] || 'credit-card';
    }
    
    const typeIcons: Record<PaymentMethod['type'], string> = {
      card: 'credit-card',
      paypal: 'circle-dollar-sign',
      'apple-pay': 'smartphone',
      'google-pay': 'smartphone',
      bank: 'building',
      wallet: 'wallet',
    };
    
    return typeIcons[type] || 'credit-card';
  };

  // Get display name for payment type
  const getPaymentTypeName = (type: PaymentMethod['type']) => {
    const names: Record<PaymentMethod['type'], string> = {
      card: 'Credit/Debit Card',
      paypal: 'PayPal',
      'apple-pay': 'Apple Pay',
      'google-pay': 'Google Pay',
      bank: 'Bank Account',
      wallet: 'Wallet Balance',
    };
    return names[type] || type;
  };

  // Format card display
  const formatCardDisplay = (method: PaymentMethod) => {
    if (method.type === 'card') {
      return `${method.brand || 'Card'} ending in ${method.last4}`;
    }
    if (method.type === 'bank') {
      return `${method.bankName || 'Bank'} ending in ${method.accountLast4}`;
    }
    if (method.type === 'paypal') {
      return method.email || 'PayPal';
    }
    if (method.type === 'wallet') {
      return `Wallet Balance: ${formatCurrency(method.walletBalance || 0)}`;
    }
    return getPaymentTypeName(method.type);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: walletCurrency,
    }).format(amount);
  };

  // Handle card input changes
  const handleCardInputChange = (field: string, value: string) => {
    const newCardData = { ...cardData, [field]: value };
    setCardData(newCardData);
    
    // Clear error for this field
    if (cardErrors[field]) {
      setCardErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    onCardInputChange?.(newCardData);
  };

  // Validate card data
  const validateCardData = () => {
    const errors: Record<string, string> = {};
    
    if (!cardData.number) {
      errors.number = 'Card number is required';
    } else if (!/^\d{13,19}$/.test(cardData.number.replace(/\s/g, ''))) {
      errors.number = 'Invalid card number';
    }
    
    if (!cardData.name) {
      errors.name = 'Cardholder name is required';
    }
    
    if (!cardData.expiryMonth || !cardData.expiryYear) {
      errors.expiry = 'Expiry date is required';
    }
    
    if (!cardData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      errors.cvv = 'Invalid CVV';
    }
    
    // Custom validation
    if (validateCard) {
      const customErrors = validateCard(cardData);
      if (customErrors) {
        Object.assign(errors, customErrors);
      }
    }
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle method selection
  const handleMethodSelect = (methodId: string) => {
    if (methodId === 'new') {
      setShowNewCard(true);
      if (allowNewCard && validateCardData()) {
        onSelect('new');
      }
    } else {
      setShowNewCard(false);
      onSelect(methodId);
    }
  };

  // Render payment method option
  const renderPaymentMethod = (method: PaymentMethod) => {
    const isSelected = selectedMethodId === method.id;
    const isProcessing = processingMethodId === method.id;
    const needsCvv = method.type === 'card' && requireCVV && isSelected;
    
    return (
      <div
        key={method.id}
        className={cn(
          'rounded-lg border p-4 cursor-pointer transition-all',
          isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-700',
          'hover:border-primary-300 dark:hover:border-primary-600',
          isProcessing && 'opacity-50 cursor-not-allowed',
          method.isExpired && 'opacity-60',
          methodClassName
        )}
        onClick={() => !isProcessing && handleMethodSelect(method.id)}
        role="radio"
        aria-checked={isSelected}
        aria-label={formatCardDisplay(method)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-4 h-4 rounded-full border-2 transition-all',
              isSelected ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 dark:border-neutral-600'
            )}>
              {isSelected && (
                <div className="w-full h-full rounded-full bg-white scale-50" />
              )}
            </div>
            
            <Icon
              icon={getPaymentIcon(method.type, method.brand)}
              size="lg"
              className="text-neutral-600 dark:text-neutral-400"
            />
            
            <div>
              <p className="font-medium">{formatCardDisplay(method)}</p>
              {method.type === 'card' && method.expiryMonth && method.expiryYear && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Expires {method.expiryMonth}/{method.expiryYear}
                </p>
              )}
              {method.holderName && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {method.holderName}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {method.isDefault && (
              <Badge variant="secondary" size="sm">Default</Badge>
            )}
            {method.isExpired && (
              <Badge variant="destructive" size="sm">Expired</Badge>
            )}
            {isProcessing && (
              <Icon icon="loader-2" size="sm" className="animate-spin" />
            )}
          </div>
        </div>
        
        {needsCvv && (
          <div className="mt-3 pt-3 border-t">
            <Input
              label="CVV"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              required
              className="w-24"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    );
  };

  // Render new card form
  const renderNewCardForm = () => {
    if (!allowNewCard) return null;
    
    return (
      <div
        className={cn(
          'rounded-lg border p-4 cursor-pointer transition-all',
          showNewCard ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-700',
          'hover:border-primary-300 dark:hover:border-primary-600',
          methodClassName
        )}
        onClick={() => handleMethodSelect('new')}
        role="radio"
        aria-checked={selectedMethodId === 'new'}
        aria-label={newCardLabel}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-4 h-4 rounded-full border-2 transition-all',
            showNewCard ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 dark:border-neutral-600'
          )}>
            {showNewCard && (
              <div className="w-full h-full rounded-full bg-white scale-50" />
            )}
          </div>
          
          <Icon icon="plus" size="lg" className="text-neutral-600 dark:text-neutral-400" />
          
          <span className="font-medium">{newCardLabel}</span>
        </div>
        
        {showNewCard && (
          <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <Input
              label="Card Number"
              type="text"
              inputMode="numeric"
              pattern="[0-9\s]*"
              value={cardData.number}
              onChange={(e) => handleCardInputChange('number', e.target.value)}
              placeholder="1234 5678 9012 3456"
              error={cardErrors.number}
              required
            />
            
            <Input
              label="Cardholder Name"
              type="text"
              value={cardData.name}
              onChange={(e) => handleCardInputChange('name', e.target.value)}
              placeholder="John Doe"
              error={cardErrors.name}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <div className="flex gap-2">
                  <Select
                    value={cardData.expiryMonth}
                    onChange={(value) => handleCardInputChange('expiryMonth', value)}
                    options={Array.from({ length: 12 }, (_, i) => ({
                      value: String(i + 1).padStart(2, '0'),
                      label: String(i + 1).padStart(2, '0'),
                    }))}
                    placeholder="MM"
                    error={cardErrors.expiry}
                  />
                  <Select
                    value={cardData.expiryYear}
                    onChange={(value) => handleCardInputChange('expiryYear', value)}
                    options={Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return {
                        value: String(year),
                        label: String(year),
                      };
                    })}
                    placeholder="YYYY"
                  />
                </div>
              </div>
              
              <Input
                label="CVV"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={cardData.cvv}
                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                placeholder="123"
                error={cardErrors.cvv}
                required
              />
            </div>
            
            {showSaveOption && (
              <Checkbox
                checked={saveCard}
                onChange={(checked) => {
                  setSaveCard(checked);
                  onSaveCard?.(checked);
                }}
                label="Save this card for future purchases"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  // Render other payment methods
  const renderOtherMethods = () => {
    const otherTypes = acceptedTypes.filter(type => 
      type !== 'card' && !savedMethods.some(m => m.type === type)
    );
    
    if (otherTypes.length === 0) return null;
    
    return (
      <div className="space-y-3">
        {otherTypes.includes('wallet') && walletBalance > 0 && (
          <div
            className={cn(
              'rounded-lg border p-4 cursor-pointer transition-all',
              selectedMethodId === 'wallet' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-700',
              'hover:border-primary-300 dark:hover:border-primary-600',
              methodClassName
            )}
            onClick={() => handleMethodSelect('wallet')}
            role="radio"
            aria-checked={selectedMethodId === 'wallet'}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 transition-all',
                  selectedMethodId === 'wallet' ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 dark:border-neutral-600'
                )}>
                  {selectedMethodId === 'wallet' && (
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </div>
                
                <Icon icon="wallet" size="lg" className="text-neutral-600 dark:text-neutral-400" />
                
                <div>
                  <p className="font-medium">Wallet Balance</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Available: {formatCurrency(walletBalance)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {otherTypes.filter(t => t !== 'wallet').map(type => (
          <div
            key={type}
            className={cn(
              'rounded-lg border p-4 cursor-pointer transition-all',
              selectedMethodId === type ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-700',
              'hover:border-primary-300 dark:hover:border-primary-600',
              methodClassName
            )}
            onClick={() => handleMethodSelect(type)}
            role="radio"
            aria-checked={selectedMethodId === type}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-4 h-4 rounded-full border-2 transition-all',
                selectedMethodId === type ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 dark:border-neutral-600'
              )}>
                {selectedMethodId === type && (
                  <div className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </div>
              
              <Icon icon={getPaymentIcon(type)} size="lg" className="text-neutral-600 dark:text-neutral-400" />
              
              <span className="font-medium">{getPaymentTypeName(type)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const cardMethods = savedMethods.filter(m => m.type === 'card');
  const otherSavedMethods = savedMethods.filter(m => m.type !== 'card');

  return (
    <div
      className={cn('space-y-6', className)}
      role="radiogroup"
      aria-label={ariaLabel || title}
    >
      {title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Saved cards */}
          {cardMethods.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {savedCardsLabel}
              </h4>
              {cardMethods.map(renderPaymentMethod)}
            </div>
          )}
          
          {/* New card option */}
          {renderNewCardForm()}
          
          {/* Other saved methods */}
          {otherSavedMethods.length > 0 && (
            <div className="space-y-3">
              {otherSavedMethods.map(renderPaymentMethod)}
            </div>
          )}
          
          {/* Other payment options */}
          {renderOtherMethods()}
        </>
      )}
    </div>
  );
};

PaymentMethodSelector.displayName = 'PaymentMethodSelector';