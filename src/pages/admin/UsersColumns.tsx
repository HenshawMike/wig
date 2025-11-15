import { ColumnDef } from '@tanstack/react-table';
import { UserData } from '@/lib/db/users';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Timestamp } from 'firebase/firestore';

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: 'displayName',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
            <AvatarFallback>
              {user.displayName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.displayName || 'No name'}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'isAdmin',
    header: 'Role',
    cell: ({ row }) => {
      const isAdmin = row.getValue('isAdmin');
      return (
        <Badge variant={isAdmin ? 'default' : 'secondary'}>
          {isAdmin ? 'Admin' : 'User'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Timestamp | null;
      return date ? format(date.toDate(), 'MMM d, yyyy') : 'N/A';
    },
  },
  {
    accessorKey: 'lastLoginAt',
    header: 'Last Active',
    cell: ({ row }) => {
      const date = row.getValue('lastLoginAt') as Timestamp | null | undefined;
      return date ? format(date.toDate(), 'MMM d, yyyy') : 'Never';
    },
  },
];
