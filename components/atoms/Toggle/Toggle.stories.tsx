import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic toggle
export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Enable feature',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Dark mode',
    description: 'Use dark theme across the application',
  },
};

export const Checked: Story = {
  args: {
    label: 'Enabled',
    checked: true,
  },
};

// States
export const Disabled: Story = {
  args: {
    label: 'Disabled toggle',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled but on',
    disabled: true,
    checked: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Error state',
    error: true,
  },
};

// Label positions
export const LabelLeft: Story = {
  args: {
    label: 'Left aligned label',
    labelPosition: 'left',
  },
};

export const LabelRight: Story = {
  args: {
    label: 'Right aligned label (default)',
    labelPosition: 'right',
  },
};

// E-commerce examples
export const NotificationSettings: Story = {
  render: () => {
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(false);
    const [pushNotif, setPushNotif] = useState(true);

    return (
      <div className="w-80 space-y-4">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Notification Preferences</h3>
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
  },
};

export const PrivacySettings: Story = {
  render: () => {
    const [shareData, setShareData] = useState(false);
    const [showProfile, setShowProfile] = useState(true);
    const [allowMessages, setAllowMessages] = useState(true);

    return (
      <div className="w-80 space-y-4">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Privacy Settings</h3>
        <Toggle
          label="Share usage data"
          description="Help us improve by sharing anonymous data"
          checked={shareData}
          onCheckedChange={setShareData}
        />
        <Toggle
          label="Public profile"
          description="Allow others to see your profile"
          checked={showProfile}
          onCheckedChange={setShowProfile}
        />
        <Toggle
          label="Direct messages"
          description="Allow vendors to message you"
          checked={allowMessages}
          onCheckedChange={setAllowMessages}
        />
      </div>
    );
  },
};

export const ShopSettings: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [acceptOrders, setAcceptOrders] = useState(true);
    const [showInventory, setShowInventory] = useState(false);

    return (
      <div className="w-80 space-y-4">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Shop Settings</h3>
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
  },
};

export const DeliveryPreferences: Story = {
  render: () => {
    const [sameDay, setSameDay] = useState(false);
    const [contactless, setContactless] = useState(true);
    const [signature, setSignature] = useState(false);

    return (
      <div className="w-80 space-y-4">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Delivery Preferences</h3>
        <Toggle
          label="Same-day delivery"
          description="When available (additional fees may apply)"
          checked={sameDay}
          onCheckedChange={setSameDay}
        />
        <Toggle
          label="Contactless delivery"
          description="Leave packages at your door"
          checked={contactless}
          onCheckedChange={setContactless}
        />
        <Toggle
          label="Signature required"
          description="Someone must sign for deliveries"
          checked={signature}
          onCheckedChange={setSignature}
          disabled={contactless}
        />
      </div>
    );
  },
};

export const AppearanceSettings: Story = {
  render: () => {
    const [darkMode, setDarkMode] = useState(false);
    const [animations, setAnimations] = useState(true);
    const [compactView, setCompactView] = useState(false);

    return (
      <div className="w-80 space-y-4">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Appearance</h3>
        <Toggle
          label="Dark mode"
          description="Use dark theme across the app"
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
        <Toggle
          label="Enable animations"
          description="Show smooth transitions and effects"
          checked={animations}
          onCheckedChange={setAnimations}
        />
        <Toggle
          label="Compact view"
          description="Show more items on screen"
          checked={compactView}
          onCheckedChange={setCompactView}
        />
      </div>
    );
  },
};

export const SecuritySettings: Story = {
  render: () => {
    const [twoFactor, setTwoFactor] = useState(true);
    const [biometric, setBiometric] = useState(false);
    const [rememberDevice, setRememberDevice] = useState(true);

    return (
      <div className="w-80 space-y-4">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Security</h3>
        <Toggle
          label="Two-factor authentication"
          description="Add an extra layer of security"
          checked={twoFactor}
          onCheckedChange={setTwoFactor}
        />
        <Toggle
          label="Biometric login"
          description="Use fingerprint or face ID"
          checked={biometric}
          onCheckedChange={setBiometric}
        />
        <Toggle
          label="Remember this device"
          description="Stay logged in on this device"
          checked={rememberDevice}
          onCheckedChange={setRememberDevice}
        />
      </div>
    );
  },
};

export const ProductSettings: Story = {
  render: () => {
    const [inStock, setInStock] = useState(true);
    const [featured, setFeatured] = useState(false);
    const [ageRestricted, setAgeRestricted] = useState(false);

    return (
      <div className="w-80 space-y-4">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Product Settings</h3>
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
  },
};

export const MarketingPreferences: Story = {
  render: () => {
    const [newsletter, setNewsletter] = useState(true);
    const [promotions, setPromotions] = useState(true);
    const [recommendations, setRecommendations] = useState(false);

    return (
      <div className="w-80 space-y-4">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Marketing Preferences</h3>
        <Toggle
          label="Newsletter"
          description="Weekly updates and news"
          checked={newsletter}
          onCheckedChange={setNewsletter}
        />
        <Toggle
          label="Promotional emails"
          description="Special offers and discounts"
          checked={promotions}
          onCheckedChange={setPromotions}
        />
        <Toggle
          label="Product recommendations"
          description="Personalized suggestions based on your activity"
          checked={recommendations}
          onCheckedChange={setRecommendations}
        />
      </div>
    );
  },
};

// Interactive example
export const InteractiveForm: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      emailNotifications: true,
      smsNotifications: false,
      darkMode: false,
      autoSave: true,
    });

    const updateSetting = (key: string, value: boolean) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
      <div className="w-96 p-6 bg-neutral-50 rounded-lg">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">General Settings</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Notifications</h4>
            <div className="space-y-3">
              <Toggle
                label="Email notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
              <Toggle
                label="SMS notifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-neutral-700 mb-3">Preferences</h4>
            <div className="space-y-3">
              <Toggle
                label="Dark mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              />
              <Toggle
                label="Auto-save"
                checked={settings.autoSave}
                onCheckedChange={(checked) => updateSetting('autoSave', checked)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-3 bg-neutral-100 rounded text-xs text-neutral-600">
          Current settings: {JSON.stringify(settings, null, 2)}
        </div>
      </div>
    );
  },
};