import { useEffect, useState } from 'react';
import { getActivities } from '../../api/activities';
import ActivityFeed from '../../components/ActivityFeed';
import type { Activity } from '../../types';

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getActivities(1, 10);
        setActivities(data.data);
      } catch (err) {
        console.error('Failed to load activities', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Recent Activities</h3>
        <span className="text-xs text-gray-400">Latest 10</span>
      </div>
      <ActivityFeed activities={activities} isLoading={isLoading} />
    </div>
  );
}
