import MainLayout from '../layouts/MainLayout';
import AdSpaceList from '../features/adspaces/AdSpaceList';

export default function AdSpacesPage() {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ad Spaces</h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse and book outdoor advertising spaces across the country
        </p>
      </div>
      <AdSpaceList />
    </MainLayout>
  );
}
