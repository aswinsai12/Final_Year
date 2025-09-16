
import React, { useEffect, useState } from 'react';
import type { Notification as NotificationType } from '../../types';
import { BellIcon } from '../icons/BellIcon';
import { SirenIcon } from '../icons/SirenIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';

interface NotificationProps {
  notification: NotificationType;
  onDismiss: (id: string) => void;
}

const ICONS: { [key in NotificationType['type']]: React.ReactElement } = {
  info: <BellIcon className="w-6 h-6 text-blue-500" />,
  success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  emergency: <SirenIcon className="w-6 h-6 text-red-500" />,
};

const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(notification.id), 300); // Allow time for exit animation
    }, 7000); // 7 seconds before auto-dismiss

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const baseClasses = 'w-full max-w-sm bg-white shadow-lg rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out transform';
  const animationClasses = exiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0';
  
  return (
    <div className={`${baseClasses} ${animationClasses}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {ICONS[notification.type]}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-bold text-slate-900">{notification.title}</p>
            <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleDismiss}
              className="bg-white rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
              <span className="sr-only">Close</span>
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
