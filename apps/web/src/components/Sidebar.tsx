import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
  },
  {
    to: '/adspaces',
    label: 'Ad Spaces',
    icon: '🏙️',
  },
  {
    to: '/adspaces/create',
    label: 'Add Ad Space',
    icon: '➕',
    roles: ['PROVIDER', 'ADMIN'],
  },
  {
    to: '/bookings',
    label: 'My Bookings',
    icon: '📋',
    roles: ['ADVERTISER', 'ADMIN'],
  },
  {
    to: '/admin',
    label: 'Admin Panel',
    icon: '⚙️',
    roles: ['ADMIN'],
  },
];

export default function Sidebar() {
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-white border-r border-gray-200 overflow-y-auto z-30">
      <nav className="p-3 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">POSTAD v1.0.0</p>
      </div>
    </aside>
  );
}
