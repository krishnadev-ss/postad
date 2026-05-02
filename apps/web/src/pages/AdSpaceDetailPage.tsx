import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdSpace } from '../api/adspaces';
import type { AdSpace } from '../types';
import MainLayout from '../layouts/MainLayout';
import BookingForm from '../features/bookings/BookingForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/format';
import { useAuth } from '../hooks/useAuth';

export default function AdSpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isAdvertiser, isAdmin } = useAuth();
  const [adspace, setAdspace] = useState<AdSpace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchAdSpace = async () => {
      try {
        const data = await getAdSpace(id);
        setAdspace(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load ad space');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdSpace();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error || !adspace) {
    return (
      <MainLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error || 'Ad space not found'}</p>
          <Link to="/adspaces" className="text-blue-600 text-sm mt-3 inline-block hover:underline">
            Back to Ad Spaces
          </Link>
        </div>
      </MainLayout>
    );
  }

  const canBook = isAuthenticated && (isAdvertiser || isAdmin);

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
        <Link to="/adspaces" className="hover:text-blue-600">
          Ad Spaces
        </Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">{adspace.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                      {adspace.type}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        adspace.is_available
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {adspace.is_available ? '● Available' : '● Unavailable'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{adspace.title}</h1>
                  <p className="text-gray-500 flex items-center gap-1.5">
                    <span>📍</span>
                    {adspace.location}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(adspace.price_per_day)}
                  </p>
                  <p className="text-gray-500 text-sm">per day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Ad Space Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Type
                </dt>
                <dd className="text-sm font-medium text-gray-900">{adspace.type}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Daily Rate
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formatCurrency(adspace.price_per_day)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Listed Since
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formatDate(adspace.created_at)}
                </dd>
              </div>
              {adspace.latitude && adspace.longitude && (
                <div>
                  <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Coordinates
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {adspace.latitude.toFixed(4)}, {adspace.longitude.toFixed(4)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Provider info */}
          {adspace.provider && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Provider Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">
                    {adspace.provider.company_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{adspace.provider.company_name}</p>
                  <p className="text-sm text-gray-500">{adspace.provider.contact_info}</p>
                </div>
              </div>
            </div>
          )}

          {/* Existing bookings */}
          {adspace.bookings && adspace.bookings.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Booked Periods ({adspace.bookings.length})
              </h2>
              <div className="space-y-2">
                {adspace.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-gray-600">
                      {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        booking.status === 'APPROVED'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking panel */}
        <div className="lg:col-span-1">
          {canBook && adspace.is_available ? (
            <BookingForm adspace={adspace} />
          ) : !isAuthenticated ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <span className="text-3xl block mb-3">🔒</span>
              <h3 className="font-semibold text-gray-900 mb-2">Sign in to Book</h3>
              <p className="text-sm text-gray-500 mb-4">
                Create an account or sign in to book this ad space
              </p>
              <Link
                to="/login"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm text-center transition-colors"
              >
                Sign In
              </Link>
            </div>
          ) : !adspace.is_available ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <span className="text-3xl block mb-3">🚫</span>
              <h3 className="font-semibold text-gray-900 mb-2">Not Available</h3>
              <p className="text-sm text-gray-500">
                This ad space is currently not available for booking
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <span className="text-3xl block mb-3">ℹ️</span>
              <p className="text-sm text-blue-700">
                Only advertisers can book ad spaces. Switch to an advertiser account to book.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
