import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const roleColors: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  PROVIDER: 'bg-orange-100 text-orange-700',
  ADVERTISER: 'bg-blue-100 text-blue-700',
};

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-xl text-gray-900">
            POST<span className="text-blue-600">AD</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <span
                className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                  roleColors[user.role] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {user.role}
              </span>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-xs text-gray-500 leading-tight">{user.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
