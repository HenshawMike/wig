
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UserData } from "@/lib/db/users";
import { useEffect } from "react";

const formSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  isAdmin: z.boolean(),
});

export type UserFormValues = z.infer<typeof formSchema>;

type UserFormProps = {
  onSubmit: (values: UserFormValues) => Promise<void>;
  initialValues?: UserData;
  submitButtonText?: string;
  isEditMode?: boolean;
};

export function UserForm({
  onSubmit,
  initialValues,
  submitButtonText = "Submit",
  isEditMode = false,
}: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: initialValues?.displayName || "",
      email: initialValues?.email || "",
      isAdmin: initialValues?.isAdmin || false,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        displayName: initialValues.displayName || "",
        email: initialValues.email || "",
        isAdmin: initialValues.isAdmin || false,
      });
    }
  }, [initialValues, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} disabled={isEditMode}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Administrator</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
