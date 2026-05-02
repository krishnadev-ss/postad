import { Link } from 'react-router-dom';
import type { AdSpace } from '../types';
import { formatCurrency } from '../utils/format';

interface AdSpaceCardProps {
  adspace: AdSpace;
  showActions?: boolean;
  onEdit?: (adspace: AdSpace) => void;
}

const typeIcons: Record<string, string> = {
  Billboard: '🏙️',
  'Digital Screen': '📺',
  'Bus Shelter': '🚌',
  Transit: '🚇',
  'Street Furniture': '🪑',
  Airport: '✈️',
  Mall: '🏬',
};

export default function AdSpaceCard({ adspace, showActions, onEdit }: AdSpaceCardProps) {
  const icon = typeIcons[adspace.type] || '📍';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header with type badge */}
      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700" />

      <div className="p-5">
        {/* Type and availability */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            <span>{icon}</span>
            {adspace.type}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              adspace.is_available
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                adspace.is_available ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            {adspace.is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {adspace.title}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <svg
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{adspace.location}</span>
        </p>

        {/* Provider */}
        {adspace.provider && (
          <p className="text-xs text-gray-400 mb-4">
            by {adspace.provider.company_name}
          </p>
        )}

        {/* Price and action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(adspace.price_per_day)}
            </span>
            <span className="text-sm text-gray-500">/day</span>
          </div>

          <div className="flex items-center gap-2">
            {showActions && onEdit && (
              <button
                onClick={() => onEdit(adspace)}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                Edit
              </button>
            )}
            <Link
              to={`/adspaces/${adspace.id}`}
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
