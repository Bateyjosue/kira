import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { User, Phone, Globe, Activity, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/patients/${id}`)
        .then((res) => setData(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading Patient File...</div>;
  if (!data) return <div className="p-8 text-center text-xs text-red-500">Patient not found.</div>;

  const { patient, consultations, responses, aiSummary } = data;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-brand-100 text-brand-800 p-4 rounded-2xl">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{patient.phoneWhatsapp}</span>
              </span>
              <span className="flex items-center space-x-1 uppercase font-mono">
                <Globe className="w-3.5 h-3.5 text-brand-600" />
                <span>Language: {patient.language}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recovery Summary Card */}
      <div className="bg-emerald-950 text-emerald-50 rounded-2xl p-6 shadow-lg border border-emerald-800">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-2">
          <Activity className="w-5 h-5" />
          <span>Gemini Pre-Visit Recovery Summary</span>
        </div>
        <p className="text-xs text-emerald-100 leading-relaxed">{aiSummary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-base text-gray-900 border-b pb-2">Clinical Consultations</h3>
          {consultations.map((c: any) => (
            <div key={c._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">{c.diagnosis}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-gray-600">{c.notes}</p>
              <div className="text-xs font-semibold text-gray-700 pt-1">
                Prescribed Medications:
                <ul className="list-disc list-inside text-gray-600 font-normal mt-0.5 space-y-0.5">
                  {c.medications?.map((m: any, idx: number) => (
                    <li key={idx}>
                      {m.name} — {m.dosage} ({m.frequency})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Responses Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-base text-gray-900 border-b pb-2">WhatsApp Follow-Up Timeline</h3>
          {responses.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No WhatsApp responses recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {responses.map((r: any) => (
                <div
                  key={r._id}
                  className={`p-4 rounded-xl border ${
                    r.hasRedFlag ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-900 flex items-center space-x-1">
                      {r.hasRedFlag ? (
                        <span className="text-red-600">🔴 Red Flag Response</span>
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(r.respondedAt), { addSuffix: true })}</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 font-medium">{r.aiSummary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
