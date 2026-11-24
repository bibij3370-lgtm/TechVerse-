import React from 'react';
import { Link } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 md:bottom-5 left-4 z-40 flex items-center gap-2.5 rounded-full bg-[#151515] text-white px-4 py-2 text-xs font-medium shadow-lg border border-zinc-700"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#C8101E]" aria-hidden="true" />
      <span>Offline Mode · Browsing cached catalog</span>
      <Link
        to="/offline"
        className="underline underline-offset-2 text-zinc-300 hover:text-white ml-1"
      >
        Details
      </Link>
    </div>
  );
};
