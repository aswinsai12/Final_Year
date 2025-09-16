
import React from 'react';
import { PillIcon } from './icons/PillIcon';
import { UsersIcon } from './icons/UsersIcon';

interface HeaderProps {
    currentView: 'patient' | 'caregiver';
    onToggleView: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onToggleView }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <PillIcon className="h-8 w-8 text-teal-500" />
            <h1 className="ml-3 text-2xl font-bold text-slate-800">PillPal AI</h1>
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                    onClick={currentView !== 'patient' ? onToggleView : undefined}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${currentView === 'patient' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    Patient View
                </button>
                <button
                    onClick={currentView !== 'caregiver' ? onToggleView : undefined}
                    className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${currentView === 'caregiver' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    <UsersIcon className="w-5 h-5" />
                    Caregiver View
                </button>
            </div>
          </div>


          <div className="flex items-center">
            <span className="text-sm font-medium text-slate-600 mr-4 hidden sm:block">Jane Doe</span>
            <img
              className="h-10 w-10 rounded-full"
              src="https://picsum.photos/100"
              alt="User Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
