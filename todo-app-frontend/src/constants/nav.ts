/**
 * Main app navigation links. Used by AppHeader and anywhere else that needs nav config.
 */
export const NAV_LINKS = [
  { to: '/dashboard', label: 'Todos' },
  { to: '/projects', label: 'Projects' },
  { to: '/categories', label: 'Categories' }
] as const;

export type NavLinkItem = (typeof NAV_LINKS)[number];

/**
 * Returns className for a NavLink based on active state. Use with React Router's NavLink.
 */
export const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
    isActive
      ? 'text-indigo-700 bg-indigo-50/80'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
  }`;
