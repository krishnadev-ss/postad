import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../api/bookings';
import { formatCurrency, calculateTotalCost } from '../../utils/format';
import type { AdSpace } from '../../types';

const schema = z
  .object({
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: 'End date must be after start date',
    path: ['end_date'],
  });

type FormValues = z.infer<typeof schema>;

interface BookingFormProps {
  adspace: AdSpace;
}

export default function BookingForm({ adspace }: BookingFormProps) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');
  const totalCost =
    startDate && endDate
      ? calculateTotalCost(adspace.price_per_day, startDate, endDate)
      : 0;

  const onSubmit = async (data: FormValues) => {
    setServerError('');
    try {
      await createBooking({
        adspace_id: adspace.id,
        start_date: data.start_date,
        end_date: data.end_date,
      });
      setSuccess(true);
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create booking';
      setServerError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <span className="text-4xl block mb-3">✅</span>
        <h3 className="text-lg font-semibold text-green-900 mb-1">Booking Submitted!</h3>
        <p className="text-green-700 text-sm">
          Your booking is now pending review. Redirecting to your bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Book This Space</h3>
      <p className="text-sm text-gray-500 mb-5">
        Select your campaign dates to submit a booking request
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{serverError}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('start_date')}
            min={today}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.start_date && (
            <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('end_date')}
            min={startDate || today}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.end_date && (
            <p className="text-red-500 text-xs mt-1">{errors.end_date.message}</p>
          )}
        </div>

        {/* Cost summary */}
        {totalCost > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Daily Rate:</span>
              <span className="font-medium text-blue-900">
                {formatCurrency(adspace.price_per_day)}/day
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-blue-700">Estimated Total:</span>
              <span className="font-bold text-blue-900">{formatCurrency(totalCost)}</span>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-700">
            <strong>Note:</strong> Bookings start as Pending and require Admin approval before confirmation.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </form>
    </div>
  );
}
