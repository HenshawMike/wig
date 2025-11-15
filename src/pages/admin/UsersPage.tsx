
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "@/lib/db/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddUserSheet } from "@/components/admin/users/AddUserSheet";
import { EditUserSheet } from "@/components/admin/users/EditUserSheet";
import { DeleteUserAlert } from "@/components/admin/users/DeleteUserAlert";
import { PlusCircle, Search } from "lucide-react";

export function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const usersData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data.email || "",
          displayName: data.displayName || "",
          photoURL: data.photoURL || "",
          isAdmin: data.isAdmin || false,
          createdAt: data.createdAt || new Date(),
          updatedAt: data.updatedAt || new Date(),
          lastLoginAt: data.lastLoginAt || null,
        } as UserData;
      });
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.displayName &&
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClick = (user: UserData) => {
    setSelectedUser(user);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteAlertOpen(true);
  };

  const handleUserAdded = (newUser: UserData) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
  };

  const handleUserUpdated = (updatedUser: UserData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.uid === updatedUser.uid ? updatedUser : user
      )
    );
  };

  const handleUserDeleted = (uid: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDate = (date: any) => {
    if (!date) return "Never";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage your store's users</p>
        </div>
        <Button onClick={() => setIsAddSheetOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.displayName || "N/A"}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.lastLoginAt)}</TableCell>
                  <TableCell className="text-right">
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
                      onClick={() => handleDeleteClick(user)}
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
      <AddUserSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onUserAdded={handleUserAdded}
      />

      <EditUserSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      <DeleteUserAlert
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        user={selectedUser}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
}
