import { useEffect, useState } from 'react';
import { useAdSpacesStore } from '../../store/adspaces.store';
import AdSpaceCard from '../../components/AdSpaceCard';
import AdSpaceFilters from './AdSpaceFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { AdSpaceFilters as Filters } from '../../types';

export default function AdSpaceList() {
  const { adspaces, isLoading, error, fetchAdSpaces, setFilters } = useAdSpacesStore();

  useEffect(() => {
    fetchAdSpaces({});
  }, []);

  const handleFilter = (filters: Filters) => {
    setFilters(filters);
    fetchAdSpaces(filters);
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar filters */}
      <aside className="w-64 flex-shrink-0">
        <AdSpaceFilters onFilter={handleFilter} isLoading={isLoading} />
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Available Ad Spaces</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isLoading ? 'Loading...' : `${adspaces.length} results found`}
            </p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && adspaces.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl block mb-3">🏙️</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No ad spaces found</h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or check back later
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && adspaces.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {adspaces.map((adspace) => (
              <AdSpaceCard key={adspace.id} adspace={adspace} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
