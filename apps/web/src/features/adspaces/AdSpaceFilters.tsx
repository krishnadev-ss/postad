import { useForm } from 'react-hook-form';
import type { AdSpaceFilters as Filters } from '../../types';

interface AdSpaceFiltersProps {
  onFilter: (filters: Filters) => void;
  isLoading?: boolean;
}

const adSpaceTypes = [
  'Billboard',
  'Digital Screen',
  'Bus Shelter',
  'Transit',
  'Street Furniture',
  'Airport',
  'Mall',
];

export default function AdSpaceFilters({ onFilter, isLoading }: AdSpaceFiltersProps) {
  const { register, handleSubmit, reset } = useForm<Filters>();

  const onSubmit = (data: Filters) => {
    // Remove empty fields
    const cleanFilters: Filters = {};
    if (data.location?.trim()) cleanFilters.location = data.location.trim();
    if (data.type) cleanFilters.type = data.type;
    if (data.minPrice) cleanFilters.minPrice = data.minPrice;
    if (data.maxPrice) cleanFilters.maxPrice = data.maxPrice;
    onFilter(cleanFilters);
  };

  const handleReset = () => {
    reset();
    onFilter({});
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span>🔍</span> Filter Ad Spaces
      </h3>

      <div className="space-y-4">
        {/* Location search */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Location
          </label>
          <input
            type="text"
            {...register('location')}
            placeholder="e.g. New York"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Type filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Ad Space Type
          </label>
          <select
            {...register('type')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Types</option>
            {adSpaceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Price Range ($/day)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              {...register('minPrice')}
              placeholder="Min"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              {...register('maxPrice')}
              placeholder="Max"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            {isLoading ? 'Searching...' : 'Apply Filters'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
