import { Home, User } from 'lucide-react';
import { z } from 'zod';

import pathsConfig from '@/config/paths.config';

const iconClasses = 'w-4';

const RouteMatchingEnd = z
  .union([z.boolean(), z.function().args(z.string()).returns(z.boolean())])
  .default(false)
  .optional();

const Divider = z.object({
  divider: z.literal(true),
});

const RouteSubChild = z.object({
  label: z.string(),
  path: z.string(),
  Icon: z.custom<React.ReactNode>().optional(),
  end: RouteMatchingEnd,
  renderAction: z.custom<React.ReactNode>().optional(),
});

const RouteChild = z.object({
  label: z.string(),
  path: z.string(),
  Icon: z.custom<React.ReactNode>().optional(),
  end: RouteMatchingEnd,
  children: z.array(RouteSubChild).default([]).optional(),
  collapsible: z.boolean().default(false).optional(),
  collapsed: z.boolean().default(false).optional(),
  renderAction: z.custom<React.ReactNode>().optional(),
});

const RouteGroup = z.object({
  label: z.string(),
  collapsible: z.boolean().optional(),
  collapsed: z.boolean().optional(),
  children: z.array(RouteChild),
  renderAction: z.custom<React.ReactNode>().optional(),
});

export const NavigationConfigSchema = z.object({
  style: z.enum(['custom', 'sidebar', 'header']).default('sidebar'),
  sidebarCollapsed: z
    .enum(['false', 'true'])
    .default('true')
    .optional()
    .transform((value) => value === `true`),
  sidebarCollapsedStyle: z.enum(['offcanvas', 'icon', 'none']).default('icon'),
  routes: z.array(z.union([RouteGroup, Divider])),
});

const routes = [
  {
    label: 'common:routes.application',
    children: [
      {
        label: 'common:routes.home',
        path: pathsConfig.app.home,
        Icon: <Home className={iconClasses} />,
        end: true,
      },
    ],
  },
  {
    label: 'common:routes.settings',
    children: [
      {
        label: 'common:routes.account',
        path: pathsConfig.app.account,
        Icon: <User className={iconClasses} />,
      },
    ],
  },
] satisfies z.infer<typeof NavigationConfigSchema>['routes'];

export const navigationConfig = NavigationConfigSchema.parse({
  routes,
  style: process.env.NEXT_PUBLIC_NAVIGATION_STYLE,
  sidebarCollapsed: process.env.NEXT_PUBLIC_HOME_SIDEBAR_COLLAPSED,
});
