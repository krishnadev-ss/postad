import type { Activity } from '../types';
import { formatRelativeTime } from '../utils/format';

interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
}

const activityIcons: Record<string, string> = {
  USER_REGISTERED: '👤',
  BOOKING_CREATED: '📋',
  BOOKING_APPROVED: '✅',
  BOOKING_REJECTED: '❌',
  ADSPACE_CREATED: '🏙️',
  DEFAULT: '📌',
};

const activityColors: Record<string, string> = {
  USER_REGISTERED: 'bg-purple-100 text-purple-700',
  BOOKING_CREATED: 'bg-blue-100 text-blue-700',
  BOOKING_APPROVED: 'bg-green-100 text-green-700',
  BOOKING_REJECTED: 'bg-red-100 text-red-700',
  ADSPACE_CREATED: 'bg-orange-100 text-orange-700',
  DEFAULT: 'bg-gray-100 text-gray-700',
};

export default function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-3xl block mb-2">📭</span>
        <p className="text-sm">No activities yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity) => {
        const icon = activityIcons[activity.type] || activityIcons.DEFAULT;
        const colorClass = activityColors[activity.type] || activityColors.DEFAULT;

        return (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${colorClass}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-snug">{activity.message}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {activity.user && (
                  <span className="text-xs text-gray-400">{activity.user.name}</span>
                )}
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(activity.created_at)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
