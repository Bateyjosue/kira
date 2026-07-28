import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';

export const Navbar: React.FC<{ alertCount?: number }> = ({ alertCount = 0 }) => {
  const { doctor, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-brand-600 text-white font-bold p-2 rounded-lg text-xl flex items-center justify-center h-10 w-10">
          CB
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">CareBridge</h1>
          <p className="text-xs text-gray-500 font-medium">AI Post-Consultation Follow-Up</p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600 hover:text-brand-600 cursor-pointer" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {alertCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
          <div className="bg-emerald-100 text-emerald-800 rounded-full p-2">
            <User className="w-5 h-5" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-800">{doctor?.name || 'Dr. Jean-Paul'}</p>
            <p className="text-xs text-gray-500">{doctor?.specialty || 'Internal Medicine'}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors ml-2"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
