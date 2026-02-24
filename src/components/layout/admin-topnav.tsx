import { GlobalSearch } from '@/features/search/components/global-search';
import { UserMenu } from '@/features/auth/components/user-menu';

interface AdminTopnavProps {
  adminEmail?: string | null;
}

export function AdminTopnav({ adminEmail }: AdminTopnavProps) {
  return (
    <header className='flex h-14 shrink-0 items-center justify-between px-2'>
      <GlobalSearch />
      {adminEmail && <UserMenu email={adminEmail} />}
    </header>
  );
}
