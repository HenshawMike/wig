
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { UserData } from "@/lib/db/users";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

type DeleteUserAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: (uid: string) => void;
  user: UserData | null;
};

const deleteUser = httpsCallable(functions, 'deleteUser');

export function DeleteUserAlert({
  open,
  onOpenChange,
  onUserDeleted,
  user,
}: DeleteUserAlertProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteUser({ uid: user.uid });
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      onUserDeleted(user.uid);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user{" "}
            <strong>{user?.email}</strong> and remove their data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
