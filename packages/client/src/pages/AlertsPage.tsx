import React, { useEffect, useState } from 'react';
import api from '../api';
import { AlertPanel } from '../components/alerts/AlertPanel';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data.filter((a: any) => !a.isRead));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading Risk Alerts...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Active Patient Risk Alerts</h2>
        <p className="text-xs text-gray-500">Real-time alerts triggered by AI response sentiment analysis</p>
      </div>

      <AlertPanel alerts={alerts} onMarkRead={handleMarkRead} />
    </div>
  );
};
