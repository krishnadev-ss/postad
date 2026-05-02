import MainLayout from '../layouts/MainLayout';
import AdminDashboard from '../features/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">
          Platform overview and booking management
        </p>
      </div>
      <AdminDashboard />
    </MainLayout>
  );
}
