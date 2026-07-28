import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { AlertPanel } from '../components/alerts/AlertPanel';
import { WhatsAppSimulator } from '../components/whatsapp/WhatsAppSimulator';
import { Users, AlertTriangle, Activity, Calendar } from 'lucide-react';

export const DashboardPage: React.FC<{ socket: any }> = ({ socket }) => {
  const { doctor } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [patientsRes, alertsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/alerts'),
      ]);
      setPatients(patientsRes.data);
      setAlerts(alertsRes.data.filter((a: any) => !a.isRead));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (socket && doctor?.id) {
      socket.emit('join_doctor_room', doctor.id);
      socket.on('new_alert', (newAlert: any) => {
        setAlerts((prev) => [newAlert, ...prev]);
      });
      socket.on('global_alert', (newAlert: any) => {
        setAlerts((prev) => [newAlert, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off('new_alert');
        socket.off('global_alert');
      }
    };
  }, [socket, doctor]);

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Clinical Overview</h2>
          <p className="text-xs text-gray-500">Real-time recovery monitoring & patient check-ins</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Patients</p>
            <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Red Flags</p>
            <p className="text-2xl font-bold text-red-600">{alerts.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">WhatsApp Follow-Ups</p>
            <p className="text-2xl font-bold text-gray-900">100% Active</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Upcoming Visits</p>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AlertPanel alerts={alerts} onMarkRead={handleMarkRead} />
        </div>

        <div>
          <WhatsAppSimulator patients={patients} onResponseProcessed={fetchData} />
        </div>
      </div>
    </div>
  );
};
