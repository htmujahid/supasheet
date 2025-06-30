import { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { AccountSidebar } from './account-sidebar';

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/home/account',
  },
  {
    title: 'Identity',
    href: '/home/account/identities',
  },
  {
    title: 'Appearance',
    href: '/home/account/appearance',
  },
  {
    title: 'Password',
    href: '/home/account/password',
  },
  {
    title: 'MFA',
    href: '/home/account/mfa',
  },
  {
    title: 'Danger',
    href: '/home/account/danger',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function AccountLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16 container mx-auto">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Account</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className=" lg:w-1/5">
          <AccountSidebar items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
