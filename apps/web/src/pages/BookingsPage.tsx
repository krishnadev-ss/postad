import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import BookingList from '../features/bookings/BookingList';

export default function BookingsPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track all your ad space booking requests
          </p>
        </div>
        <Link
          to="/adspaces"
          className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          Browse Ad Spaces
        </Link>
      </div>
      <BookingList />
    </MainLayout>
  );
}
