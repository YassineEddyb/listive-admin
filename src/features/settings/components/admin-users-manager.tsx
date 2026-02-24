'use client';

import { useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { AdminUserRow } from '@/features/settings/controllers/get-admin-users';
import { addAdminUser, removeAdminUser } from '@/features/settings/actions/manage-admin-users';
import { formatRelativeDate } from '@/utils/format-relative-date';
import { useRouter } from 'next/navigation';

interface AdminUsersManagerProps {
  adminUsers: AdminUserRow[];
  currentAdminId: string;
}

export function AdminUsersManager({ adminUsers, currentAdminId }: AdminUsersManagerProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    const result = await addAdminUser(email, role, currentAdminId);
    if (result.success) {
      setEmail('');
      router.refresh();
    } else {
      setError(result.error || 'Failed to add admin');
    }
    setLoading(false);
  }

  async function handleRemove(adminUserId: string) {
    setLoading(true);
    setError(null);

    const result = await removeAdminUser(adminUserId, currentAdminId);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || 'Failed to remove admin');
    }
    setLoading(false);
  }

  return (
    <div className='space-y-6'>
      {/* Add Admin */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-base'>
            <UserPlus className='h-4 w-4' />
            Add Admin User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-end gap-3'>
            <div className='flex-1 space-y-1.5'>
              <label className='text-sm font-medium'>Email Address</label>
              <Input
                placeholder='user@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='w-32 space-y-1.5'>
              <label className='text-sm font-medium'>Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='admin'>Admin</SelectItem>
                  <SelectItem value='super_admin'>Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} disabled={loading || !email.trim()}>
              <UserPlus className='mr-2 h-4 w-4' />
              Add
            </Button>
          </div>
          {error && <p className='mt-2 text-sm text-destructive'>{error}</p>}
          <p className='mt-2 text-xs text-muted-foreground'>
            The email must belong to an existing registered user in Listive.
          </p>
        </CardContent>
      </Card>

      {/* Admin Users List */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Current Admins ({adminUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className='w-[80px]' />
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className='text-sm font-medium'>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === 'super_admin' ? 'warning' : 'default'}>
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {formatRelativeDate(admin.created_at)}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' size='icon' className='text-destructive hover:text-destructive'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Admin</AlertDialogTitle>
                          <AlertDialogDescription>
                            Remove <strong>{admin.email}</strong> from the admin panel? They will lose
                            all admin access immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemove(admin.id)}
                            className='bg-destructive hover:bg-destructive/90'
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
