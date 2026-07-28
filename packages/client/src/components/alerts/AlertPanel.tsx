import React from 'react';
import { IAlert } from '@carebridge/shared';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertPanelProps {
  alerts: IAlert[];
  onMarkRead: (id: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onMarkRead }) => {
  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
        <h3 className="text-base font-semibold text-gray-800">No Pending Risk Alerts</h3>
        <p className="text-xs text-gray-500">All patient responses are within safe parameters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
      <div className="p-4 bg-red-50/50 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-2 text-red-700 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
          <span>Active Patient Red Flags ({alerts.length})</span>
        </div>
      </div>
      <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
        {alerts.map((alert) => (
          <div key={alert._id} className="p-4 hover:bg-gray-50 transition-colors flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-gray-900">{alert.patientName || 'Patient'}</span>
                <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{alert.message}</p>
              <div className="flex items-center space-x-1 text-[11px] text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  {alert.createdAt
                    ? formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })
                    : 'Just now'}
                </span>
              </div>
            </div>
            {!alert.isRead && (
              <button
                onClick={() => alert._id && onMarkRead(alert._id)}
                className="text-xs font-medium bg-gray-100 hover:bg-brand-100 text-gray-700 hover:text-brand-800 px-3 py-1.5 rounded-lg transition-colors ml-4 whitespace-nowrap"
              >
                Acknowledge
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
