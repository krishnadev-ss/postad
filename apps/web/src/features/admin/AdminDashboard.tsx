import { useEffect, useState } from 'react';
import { getDashboard } from '../../api/admin';
import { getAllBookings } from '../../api/bookings';
import type { AdminDashboard as DashboardData, Booking } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import BookingApproval from './BookingApproval';
import { formatCurrency } from '../../utils/format';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, bookingData] = await Promise.all([
          getDashboard(),
          getAllBookings(currentPage, 10),
        ]);
        setDashboard(dashData);
        setBookings(bookingData.data);
        setTotalPages(bookingData.pagination.totalPages);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleStatusChange = (bookingId: string, status: 'APPROVED' | 'REJECTED') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
    );
    if (dashboard) {
      setDashboard((prev) => {
        if (!prev) return prev;
        const newStats = { ...prev.stats };
        newStats.pending_bookings = Math.max(0, newStats.pending_bookings - 1);
        if (status === 'APPROVED') newStats.approved_bookings++;
        else newStats.rejected_bookings++;
        return { ...prev, stats: newStats };
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!dashboard) return null;

  const { stats } = dashboard;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.total_users}
          icon="👥"
          color="bg-purple-50"
        />
        <StatCard
          title="Ad Spaces"
          value={stats.total_adspaces}
          icon="🏙️"
          color="bg-blue-50"
        />
        <StatCard
          title="Total Bookings"
          value={stats.total_bookings}
          icon="📋"
          color="bg-indigo-50"
        />
        <StatCard
          title="Approved Revenue"
          value={formatCurrency(stats.approved_revenue)}
          icon="💰"
          color="bg-green-50"
        />
      </div>

      {/* Booking Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-900">{stats.pending_bookings}</p>
          <p className="text-sm text-yellow-700 font-medium mt-1">Pending</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-900">{stats.approved_bookings}</p>
          <p className="text-sm text-green-700 font-medium mt-1">Approved</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-900">{stats.rejected_bookings}</p>
          <p className="text-sm text-red-700 font-medium mt-1">Rejected</p>
        </div>
      </div>

      {/* Booking Management Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Booking Management</h3>
          <span className="text-sm text-gray-400">{bookings.length} bookings</span>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No bookings to manage</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Ad Space
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Advertiser
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Dates
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <BookingApproval
                    key={booking.id}
                    booking={booking}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
