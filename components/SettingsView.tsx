import { useState } from 'react';
import logger from '@/lib/logger';
import type { ReactElement } from 'react';
import { useUser } from '@supabase/auth-helpers-react';

interface FormData {
  email: string;
  currentPassword: string;
  newPassword: string;
  theme: string;
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export default function SettingsView(): ReactElement {
  const user = useUser();
  const [formData, setFormData] = useState<FormData>({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    theme: 'light',
    language: 'en',
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Update failed');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      logger.error({ err: error }, 'Error updating settings');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div>
            <label className="block text-sm font-medium">Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border p-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border p-2"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Enable all notifications</span>
            </label>
            
            <label className="flex items-center space-x-2 ml-4">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Email notifications</span>
            </label>
            
            <label className="flex items-center space-x-2 ml-4">
              <input
                type="checkbox"
                name="pushNotifications"
                checked={formData.pushNotifications}
                onChange={handleInputChange}
                className="rounded"
              />
              <span>Push notifications</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}