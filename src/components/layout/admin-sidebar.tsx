'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CreditCard,
  Home,
  ImageIcon,
  Layers,
  LayoutDashboard,
  List,
  MessageSquare,
  Package,
  ScrollText,
  Server,
  Settings,
  Store,
  TicketCheck,
  Users,
  Webhook,
} from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

interface NavSection {
  label: string;
  items: { name: string; href: string; icon: typeof Home }[];
}

const navigationSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: ROUTES.dashboard, icon: Home },
      { name: 'Analytics', href: ROUTES.analytics, icon: BarChart3 },
    ],
  },
  {
    label: 'Users & Billing',
    items: [
      { name: 'Users', href: ROUTES.users, icon: Users },
      { name: 'Subscriptions', href: ROUTES.subscriptions, icon: CreditCard },
      { name: 'Credits', href: ROUTES.credits, icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Products', href: ROUTES.products, icon: Package },
      { name: 'Images', href: ROUTES.images, icon: ImageIcon },
      { name: 'Stores', href: ROUTES.stores, icon: Store },
      { name: 'Listings', href: ROUTES.listings, icon: List },
      { name: 'Templates', href: ROUTES.templates, icon: Layers },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Webhooks', href: ROUTES.webhooks, icon: Webhook },
      { name: 'System Health', href: ROUTES.system, icon: Server },
      { name: 'Settings', href: ROUTES.settings, icon: Settings },
    ],
  },
  {
    label: 'Activity',
    items: [
      { name: 'Support', href: ROUTES.support, icon: TicketCheck },
      { name: 'Feedback', href: ROUTES.feedback, icon: MessageSquare },
      { name: 'Audit Log', href: ROUTES.auditLog, icon: ScrollText },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className='flex h-full w-64 flex-col bg-white rounded-2xl shadow-soft'>
      {/* Logo */}
      <div className='flex items-center gap-2 px-6 py-6'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-dark'>
          <LayoutDashboard className='h-4 w-4 text-white' />
        </div>
        <div>
          <span className='text-lg font-bold text-brand-dark'>Listive</span>
          <span className='ml-1 text-xs font-medium text-brand-gray'>Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto px-3 py-2'>
        {navigationSections.map((section, idx) => (
          <div key={section.label} className={cn(idx > 0 && 'mt-4')}>
            <p className='mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-brand-gray/60'>
              {section.label}
            </p>
            <ul className='space-y-0.5'>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === ROUTES.dashboard
                    ? pathname === item.href
                    : pathname === item.href || pathname?.startsWith(item.href + '/');

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-brand-dark text-white shadow-sm'
                          : 'text-brand-gray hover:bg-brand-light hover:text-brand-dark'
                      )}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className='border-t border-brand-border/50 px-4 py-4'>
        <p className='text-xs text-muted-foreground'>Listive Admin Panel</p>
      </div>
    </aside>
  );
}
