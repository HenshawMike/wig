import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { addAdmin, removeAdmin } from '@/lib/db/admin';

export function AdminUsers() {
  const { user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // In a real app, you would look up the user by email and get their UID
      // For now, we'll just show a success message
      // const uid = await getUserIdByEmail(email);
      // await addAdmin(uid, email);
      
      toast({
        title: 'Success',
        description: `Added admin privileges to ${email}`,
      });
      setEmail('');
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to add admin',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Users</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add Admin</h2>
        <form onSubmit={handleAddAdmin} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter user's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Admin'}
          </Button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Current Admins</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Admin users will be listed here</p>
          {/* In a real app, you would fetch and list all admin users here */}
        </div>
      </div>
    </div>
  );
}
