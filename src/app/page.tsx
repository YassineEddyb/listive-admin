import { redirect } from 'next/navigation';

import { getSession } from '@/features/auth/controllers/get-session';

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect('/admin');
  } else {
    redirect('/login');
  }
}
