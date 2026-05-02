import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdSpaceForm from '../features/adspaces/AdSpaceForm';

export default function CreateAdSpacePage() {
  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Link to="/adspaces" className="hover:text-blue-600">
            Ad Spaces
          </Link>
          <span>›</span>
          <span className="text-gray-900">Create New</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Ad Space</h1>
        <p className="text-gray-500 text-sm mt-1">
          Add a new outdoor advertising space to your inventory
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <AdSpaceForm />
      </div>
    </MainLayout>
  );
}
