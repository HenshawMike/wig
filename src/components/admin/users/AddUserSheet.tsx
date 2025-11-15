
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

type AddUserSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: UserData) => void;
};

const createUser = httpsCallable(functions, 'createUser');

export function AddUserSheet({
  open,
  onOpenChange,
  onUserAdded,
}: AddUserSheetProps) {
  const { toast } = useToast();

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const result = await createUser(values);
      const newUser: UserData = {
        uid: (result.data as any).uid,
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
      };

      toast({
        title: "Success",
        description: "User created successfully.",
      });
      onUserAdded(newUser);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New User</SheetTitle>
          <SheetDescription>
            Fill out the form to add a new user to the system.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <UserForm
            onSubmit={handleSubmit}
            submitButtonText="Create User"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
