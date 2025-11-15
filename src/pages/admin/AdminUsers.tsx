import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Trash2, UserPlus, AlertTriangle } from 'lucide-react';
import { addAdmin, removeAdmin, isAdmin as checkAdmin } from '@/lib/db/admin';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminUser {
  uid: string;
  email: string;
  createdAt: string;
}

export function AdminUsers() {
  const { user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchAdminUsers();
    }
  }, [isAdmin]);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const adminsCollection = collection(db, 'admins');
      const snapshot = await getDocs(adminsCollection);
      const admins = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as AdminUser[];
      setAdminUsers(admins);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch admin users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // Search for user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('User not found');
      }
      
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      
      // Check if user is already an admin
      const userIsAdmin = await checkAdmin(userId);
      if (userIsAdmin) {
        throw new Error('User is already an admin');
      }
      
      // Add admin role
      await addAdmin(userId, email);
      
      // Refresh admin list
      await fetchAdminUsers();
      
      toast({
        title: 'Success',
        description: `Added admin privileges to ${email}`,
      });
      setEmail('');
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add admin',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveAdmin = async (admin: AdminUser) => {
    if (!admin) return;
    
    setSelectedUser(admin);
    setShowDeleteDialog(true);
  };
  
  const confirmRemoveAdmin = async () => {
    if (!selectedUser) return;
    
    try {
      setIsDeleting(selectedUser.uid);
      await removeAdmin(selectedUser.uid);
      
      // Refresh admin list
      await fetchAdminUsers();
      
      toast({
        title: 'Success',
        description: `Removed admin privileges from ${selectedUser.email}`,
      });
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove admin',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
      setSelectedUser(null);
      setShowDeleteDialog(false);
    }
  };
  
  const filteredAdmins = adminUsers.filter(admin => 
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const isCurrentUser = (uid: string) => user?.uid === uid;

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>You don't have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">Manage admin users and their permissions</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Admin</CardTitle>
          <CardDescription>Enter the email of the user you want to make an admin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Admin
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                {adminUsers.length} {adminUsers.length === 1 ? 'admin' : 'admins'} found
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search admins..."
                className="pl-9 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? 'No matching admins found' : 'No admin users found'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Added On</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.uid}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {admin.email}
                          {isCurrentUser(admin.uid) && (
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                              You
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {!isCurrentUser(admin.uid) ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAdmin(admin)}
                            disabled={isDeleting === admin.uid}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            {isDeleting === admin.uid ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Current user</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin Privileges</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove admin privileges from <span className="font-semibold">{selectedUser?.email}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting !== null}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={confirmRemoveAdmin}
              disabled={isDeleting !== null}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove Admin'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
