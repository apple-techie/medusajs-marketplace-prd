# Toggle Component

A switch-like UI control for binary on/off states. Perfect for settings, preferences, and feature toggles.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Toggle } from '@/components/atoms/Toggle';

// Basic toggle
<Toggle />

// With label
<Toggle label="Enable notifications" />

// With label and description
<Toggle 
  label="Dark mode"
  description="Use dark theme across the application"
/>

// Controlled
<Toggle 
  label="Feature flag"
  checked={isEnabled}
  onCheckedChange={setIsEnabled}
/>

// With error state
<Toggle 
  label="Required setting"
  error={hasError}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'error'` | `'default'` | Visual variant |
| `label` | `ReactNode` | - | Toggle label |
| `labelClassName` | `string` | - | Custom label styles |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position |
| `description` | `string` | - | Helper text below label |
| `descriptionClassName` | `string` | - | Custom description styles |
| `error` | `boolean` | `false` | Error state |
| `containerClassName` | `string` | - | Container wrapper classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Default checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Checked change handler |

## Examples

### E-commerce Use Cases

#### Notification Settings
```tsx
function NotificationSettings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Notification Preferences</h3>
      <Toggle
        label="Email notifications"
        description="Receive order updates via email"
        checked={emailNotif}
        onCheckedChange={setEmailNotif}
      />
      <Toggle
        label="SMS notifications"
        description="Receive order updates via SMS"
        checked={smsNotif}
        onCheckedChange={setSmsNotif}
      />
      <Toggle
        label="Push notifications"
        description="Receive in-app notifications"
        checked={pushNotif}
        onCheckedChange={setPushNotif}
      />
    </div>
  );
}
```

#### Shop Settings
```tsx
function ShopSettings() {
  const [isOpen, setIsOpen] = useState(true);
  const [acceptOrders, setAcceptOrders] = useState(true);
  const [showInventory, setShowInventory] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Shop Settings</h3>
      <Toggle
        label="Shop is open"
        description="Customers can view and order from your shop"
        checked={isOpen}
        onCheckedChange={setIsOpen}
      />
      <Toggle
        label="Accept new orders"
        description="Automatically accept incoming orders"
        checked={acceptOrders}
        onCheckedChange={setAcceptOrders}
        disabled={!isOpen}
      />
      <Toggle
        label="Show inventory count"
        description="Display remaining stock to customers"
        checked={showInventory}
        onCheckedChange={setShowInventory}
      />
    </div>
  );
}
```

#### Privacy Settings
```tsx
function PrivacySettings() {
  const [shareData, setShareData] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <div className="space-y-4">
      <Toggle
        label="Share usage data"
        description="Help us improve by sharing anonymous data"
        checked={shareData}
        onCheckedChange={setShareData}
      />
      <Toggle
        label="Public profile"
        description="Allow others to see your profile"
        checked={publicProfile}
        onCheckedChange={setPublicProfile}
      />
    </div>
  );
}
```

#### Product Settings
```tsx
function ProductSettings() {
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [ageRestricted, setAgeRestricted] = useState(false);

  return (
    <div className="space-y-4">
      <Toggle
        label="In stock"
        description="Product is available for purchase"
        checked={inStock}
        onCheckedChange={setInStock}
      />
      <Toggle
        label="Featured product"
        description="Show in featured section"
        checked={featured}
        onCheckedChange={setFeatured}
      />
      <Toggle
        label="Age restricted"
        description="Requires age verification (21+)"
        checked={ageRestricted}
        onCheckedChange={setAgeRestricted}
      />
    </div>
  );
}
```

### Layout Options

#### Label Position
```tsx
// Label on the right (default)
<Toggle 
  label="Right label"
  labelPosition="right"
/>

// Label on the left
<Toggle 
  label="Left label"
  labelPosition="left"
/>
```

#### With Custom Styling
```tsx
<Toggle
  label="Custom styled"
  className="data-[state=checked]:bg-success-500"
  labelClassName="text-lg font-bold"
  containerClassName="p-4 bg-neutral-50 rounded-lg"
/>
```

### Form Validation

```tsx
function RequiredToggle() {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      setError(true);
      return;
    }
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toggle
        label="I agree to the terms and conditions"
        checked={agreed}
        onCheckedChange={(checked) => {
          setAgreed(checked);
          setError(false);
        }}
        error={error}
      />
      {error && (
        <p className="text-sm text-danger-600 mt-2">
          You must agree to continue
        </p>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Dependent Toggles

```tsx
function DependentToggles() {
  const [mainFeature, setMainFeature] = useState(false);
  const [subFeature1, setSubFeature1] = useState(false);
  const [subFeature2, setSubFeature2] = useState(false);

  return (
    <div className="space-y-3">
      <Toggle
        label="Enable main feature"
        checked={mainFeature}
        onCheckedChange={setMainFeature}
      />
      <div className="ml-6 space-y-3">
        <Toggle
          label="Sub-feature 1"
          checked={subFeature1}
          onCheckedChange={setSubFeature1}
          disabled={!mainFeature}
        />
        <Toggle
          label="Sub-feature 2"
          checked={subFeature2}
          onCheckedChange={setSubFeature2}
          disabled={!mainFeature}
        />
      </div>
    </div>
  );
}
```

## Accessibility

- Uses native checkbox input for full accessibility
- Keyboard accessible (Space to toggle)
- Screen reader friendly
- Proper ARIA attributes
- Focus states for keyboard users
- Label association for larger click targets

## Styling

- Smooth transitions for state changes
- Primary color when checked, neutral when unchecked
- Clear visual feedback for all states
- Consistent with other form components
- Error state with danger coloring
- Disabled state with reduced opacity

## Integration with Forms

```tsx
// With React Hook Form
import { useForm, Controller } from 'react-hook-form';

function SettingsForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      emailNotifications: true,
      darkMode: false,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="emailNotifications"
        control={control}
        render={({ field }) => (
          <Toggle
            label="Email notifications"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Controller
        name="darkMode"
        control={control}
        render={({ field }) => (
          <Toggle
            label="Dark mode"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </form>
  );
}
```

## Best Practices

1. Use clear, action-oriented labels
2. Provide descriptions for complex settings
3. Group related toggles together
4. Disable dependent toggles when parent is off
5. Show immediate visual feedback
6. Save preferences automatically or provide save button
7. Use error state for required toggles
8. Consider using tooltips for additional context