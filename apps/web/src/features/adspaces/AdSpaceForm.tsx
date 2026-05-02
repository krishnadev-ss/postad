import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { createAdSpace, updateAdSpace } from '../../api/adspaces';
import type { AdSpace, CreateAdSpaceFormData } from '../../types';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  location: z.string().min(3, 'Location is required'),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  type: z.string().min(1, 'Please select a type'),
  price_per_day: z.coerce.number().min(1, 'Price must be at least $1'),
  is_available: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

const adSpaceTypes = [
  'Billboard',
  'Digital Screen',
  'Bus Shelter',
  'Transit',
  'Street Furniture',
  'Airport',
  'Mall',
];

interface AdSpaceFormProps {
  editData?: AdSpace;
}

export default function AdSpaceForm({ editData }: AdSpaceFormProps) {
  const navigate = useNavigate();
  const isEditing = !!editData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_available: true,
    },
  });

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title,
        location: editData.location,
        latitude: editData.latitude ?? undefined,
        longitude: editData.longitude ?? undefined,
        type: editData.type,
        price_per_day: editData.price_per_day,
        is_available: editData.is_available,
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditing && editData) {
        await updateAdSpace(editData.id, data);
      } else {
        await createAdSpace(data as CreateAdSpaceFormData);
      }
      navigate('/adspaces');
    } catch (error: any) {
      console.error('Failed to save ad space:', error);
      alert(error.response?.data?.message || 'Failed to save ad space');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 gap-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('title')}
            placeholder="e.g. Times Square Giant Billboard"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('location')}
            placeholder="e.g. Times Square, New York, NY"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        {/* Latitude & Longitude */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Latitude (optional)
            </label>
            <input
              type="number"
              step="any"
              {...register('latitude')}
              placeholder="40.7580"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Longitude (optional)
            </label>
            <input
              type="number"
              step="any"
              {...register('longitude')}
              placeholder="-73.9855"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ad Space Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('type')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Select a type</option>
            {adSpaceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Price per Day (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              {...register('price_per_day')}
              placeholder="500"
              min="1"
              className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {errors.price_per_day && (
            <p className="text-red-500 text-xs mt-1">{errors.price_per_day.message}</p>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_available"
            {...register('is_available')}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
            Available for booking
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isSubmitting
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
            ? 'Update Ad Space'
            : 'Create Ad Space'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/adspaces')}
          className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
