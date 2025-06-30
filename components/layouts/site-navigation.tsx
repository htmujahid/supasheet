'use client';

import Link from 'next/link';

import { Menu } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Trans } from '@/components/makerkit/trans';

import { SiteNavigationItem } from './site-navigation-item';
// import { SidebarTrigger } from '../ui/sidebar';

/**
 * Add your navigation links here
 *
 * @example
 *
 * {
 *   FAQ: {
 *     label: 'marketing:faq',
 *     path: '/faq',
 *   },
 *   Pricing: {
 *     label: 'marketing:pricing',
 *     path: '/pricing',
 *   },
 * }
 */

const links: Record<
  string,
  {
    label: string;
    path: string;
  }
> = {
  /*
    FAQ: {
      label: 'marketing:faq',
      path: '/faq',
    },
     */
};

export function SiteNavigation() {
  const NavItems = Object.values(links).map((item) => {
    return (
      <SiteNavigationItem key={item.path} path={item.path}>
        <Trans i18nKey={item.label} />
      </SiteNavigationItem>
    );
  });

  return (
    <>
      <div className={'hidden items-center justify-center md:flex'}>
        <NavigationMenu className={'px-4 py-2'}>
          <NavigationMenuList className={'space-x-5'}>
            {NavItems}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className={'flex justify-start sm:items-center md:hidden'}>
        {/* <SidebarTrigger className='size-9 opacity-80' iconClassName='size-6' /> */}
        <MobileDropdown />
      </div>
    </>
  );
}

function MobileDropdown() {
  if (Object.values(links).length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={'Open Menu'}>
        <Menu className={'h-8 w-8'} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className={'w-full'}>
        {Object.values(links).map((item) => {
          const className = 'flex w-full h-full items-center';

          return (
            <DropdownMenuItem key={item.path} asChild>
              <Link className={className} href={item.path}>
                <Trans i18nKey={item.label} />
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}