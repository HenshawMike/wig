import React from 'react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { updateAdminProfile } from '@/lib/db/admin';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateAdminProfile(user.id, { name, email });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="store-settings">
        <TabsList>
          <TabsTrigger value="store-settings">Store Settings</TabsTrigger>
          <TabsTrigger value="payment-settings">Payment Settings</TabsTrigger>
          <TabsTrigger value="security-settings">Security Settings</TabsTrigger>
          <TabsTrigger value="admin-profile">Admin Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="store-settings">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Store Settings</h2>
            <p>Store settings will be here.</p>
          </div>
        </TabsContent>
        <TabsContent value="payment-settings">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
            <p>Payment settings will be here.</p>
          </div>
        </TabsContent>
        <TabsContent value="security-settings">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <p>Security settings will be here.</p>
          </div>
        </TabsContent>
        <TabsContent value="admin-profile">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Admin Profile</h2>
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
