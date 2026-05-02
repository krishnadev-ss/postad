import { useEffect, useState } from 'react';
import { getUserBookings } from '../../api/bookings';
import type { Booking } from '../../types';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, formatCurrency, calculateTotalCost } from '../../utils/format';

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-3">📋</span>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookings yet</h3>
        <p className="text-gray-500 text-sm">
          Browse ad spaces and submit a booking request to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const totalCost = booking.adspace
          ? calculateTotalCost(
              booking.adspace.price_per_day,
              booking.start_date,
              booking.end_date,
            )
          : 0;

        return (
          <div
            key={booking.id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {booking.adspace?.title || 'Ad Space'}
                  </h3>
                  <BookingStatusBadge status={booking.status} size="sm" />
                </div>

                {booking.adspace && (
                  <p className="text-sm text-gray-500 mb-3">{booking.adspace.location}</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Start Date</p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(booking.start_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">End Date</p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(booking.end_date)}
                    </p>
                  </div>
                  {booking.adspace && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Daily Rate</p>
                      <p className="text-sm font-medium text-gray-700">
                        {formatCurrency(booking.adspace.price_per_day)}/day
                      </p>
                    </div>
                  )}
                  {totalCost > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Est. Total</p>
                      <p className="text-sm font-bold text-blue-700">
                        {formatCurrency(totalCost)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">Booked on</p>
                <p className="text-sm text-gray-600">{formatDate(booking.created_at)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
