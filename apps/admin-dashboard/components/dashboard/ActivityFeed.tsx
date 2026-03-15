import { ReactNode } from "react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: ReactNode;
  iconBg: string; // Tailwind class
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return <div className="text-sm text-gray-500 py-4 text-center">No recent activity.</div>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((item, itemIdx) => (
          <li key={item.id}>
            <div className="relative pb-8">
              {itemIdx !== items.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${item.iconBg}`}>
                    {item.icon}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                  <div className="text-right text-xs whitespace-nowrap text-gray-500">
                    <time dateTime={item.time}>{item.time}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
