
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { UserData } from "@/lib/db/users";
import { UserForm, UserFormValues } from "./UserForm";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

type EditUserSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (user: UserData) => void;
  user: UserData | null;
};

const updateUser = httpsCallable(functions, 'updateUser');

export function EditUserSheet({
  open,
  onOpenChange,
  onUserUpdated,
  user,
}: EditUserSheetProps) {
  const { toast } = useToast();

  const handleSubmit = async (values: UserFormValues) => {
    if (!user) return;

    try {
      await updateUser({ uid: user.uid, ...values });
      const updatedUser: UserData = {
        ...user,
        ...values,
        updatedAt: new Date(),
      };

      toast({
        title: "Success",
        description: "User updated successfully.",
      });
      onUserUpdated(updatedUser);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Update the user's information.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {user && (
            <UserForm
              onSubmit={handleSubmit}
              initialValues={user}
              submitButtonText="Update User"
              isEditMode={true}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
