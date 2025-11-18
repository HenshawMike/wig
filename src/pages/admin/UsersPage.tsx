import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData } from '@/lib/db/users';
import { toast } from '@/components/ui/use-toast';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    email: '',
    isAdmin: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const usersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            uid: doc.id,
            email: data.email || '',
            displayName: data.displayName || '',
            photoURL: data.photoURL || '',
            isAdmin: data.isAdmin || false,
            createdAt: data.createdAt || new Date(),
            updatedAt: data.updatedAt || new Date(),
            lastLoginAt: data.lastLoginAt || null
          } as UserData;
        });
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return 'Never';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleString();
  };

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setEditFormData({
      displayName: user.displayName || '',
      email: user.email || '',
      isAdmin: user.isAdmin || false,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const userRef = doc(db, 'users', editingUser.uid);
      await updateDoc(userRef, {
        displayName: editFormData.displayName,
        email: editFormData.email,
        isAdmin: editFormData.isAdmin,
        updatedAt: new Date(),
      });

      // Update local state
      setUsers(users.map(user => 
        user.uid === editingUser.uid 
          ? { ...user, ...editFormData }
          : user
      ));

      setEditingUser(null);
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteDoc(doc(db, 'users', userToDelete));
      
      // Update local state
      setUsers(users.filter(user => user.uid !== userToDelete));
      
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Users</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your store's users
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.displayName || 'N/A'}</TableCell>
                      <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{formatDate(user.lastLoginAt)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteClick(user.uid)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">
                  Name
                </Label>
                <Input
                  id="displayName"
                  value={editFormData.displayName}
                  onChange={(e) => setEditFormData({...editFormData, displayName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={editFormData.isAdmin}
                  onChange={(e) => setEditFormData({...editFormData, isAdmin: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isAdmin"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Administrator
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
