import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import RecentActivities from '../features/dashboard/RecentActivities';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { user, isAdmin, isProvider, isAdvertiser } = useAuth();

  return (
    <MainLayout>
      {/* Welcome header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening on your POSTAD account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Quick actions & info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/adspaces"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <span className="text-2xl">🏙️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    Browse Ad Spaces
                  </p>
                  <p className="text-xs text-gray-400">Find the perfect location</p>
                </div>
              </Link>

              {(isAdvertiser || isAdmin) && (
                <Link
                  to="/bookings"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                      My Bookings
                    </p>
                    <p className="text-xs text-gray-400">Track your campaigns</p>
                  </div>
                </Link>
              )}

              {(isProvider || isAdmin) && (
                <Link
                  to="/adspaces/create"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors group"
                >
                  <span className="text-2xl">➕</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-700">
                      Add Ad Space
                    </p>
                    <p className="text-xs text-gray-400">List a new location</p>
                  </div>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                >
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">
                      Admin Panel
                    </p>
                    <p className="text-xs text-gray-400">Manage the platform</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Account info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Account Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Full Name
                </dt>
                <dd className="text-sm font-medium text-gray-900">{user?.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Email
                </dt>
                <dd className="text-sm font-medium text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Account Type
                </dt>
                <dd>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                      user?.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : user?.role === 'PROVIDER'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user?.role}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right column - Activity feed */}
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
      </div>
    </MainLayout>
  );
}
