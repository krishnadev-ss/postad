import { useState } from 'react';
import { updateBookingStatus } from '../../api/bookings';
import type { Booking } from '../../types';
import BookingStatusBadge from '../../components/BookingStatusBadge';
import { formatDate, formatCurrency, calculateTotalCost } from '../../utils/format';

interface BookingApprovalProps {
  booking: Booking;
  onStatusChange: (bookingId: string, status: 'APPROVED' | 'REJECTED') => void;
}

export default function BookingApproval({ booking, onStatusChange }: BookingApprovalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: 'APPROVED' | 'REJECTED') => {
    setIsLoading(true);
    try {
      await updateBookingStatus(booking.id, status);
      onStatusChange(booking.id, status);
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to ${status.toLowerCase()} booking`);
    } finally {
      setIsLoading(false);
    }
  };

  const totalCost = booking.adspace
    ? calculateTotalCost(booking.adspace.price_per_day, booking.start_date, booking.end_date)
    : 0;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {booking.adspace?.title || 'N/A'}
          </p>
          <p className="text-xs text-gray-400">{booking.adspace?.location}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm text-gray-900">{booking.user?.name}</p>
          <p className="text-xs text-gray-400">{booking.user?.email}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-semibold text-gray-900">
          {totalCost > 0 ? formatCurrency(totalCost) : '—'}
        </span>
      </td>
      <td className="px-4 py-3">
        <BookingStatusBadge status={booking.status} size="sm" />
      </td>
      <td className="px-4 py-3">
        {booking.status === 'PENDING' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('APPROVED')}
              disabled={isLoading}
              className="text-xs font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange('REJECTED')}
              disabled={isLoading}
              className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No action</span>
        )}
      </td>
    </tr>
  );
}
