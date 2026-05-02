import type { BookingStatus } from '../types';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md';
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 border border-green-200',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border border-red-200',
  },
};

export default function BookingStatusBadge({
  status,
  size = 'md',
}: BookingStatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${config.className}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === 'PENDING'
            ? 'bg-yellow-500'
            : status === 'APPROVED'
            ? 'bg-green-500'
            : 'bg-red-500'
        }`}
      />
      {config.label}
    </span>
  );
}
