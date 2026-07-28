import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Globe, ChevronRight } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patients')
      .then((res) => setPatients(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.phoneWhatsapp.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Registered Patients</h2>
          <p className="text-xs text-gray-500">Manage patient contacts & WhatsApp language settings</p>
        </div>
        <Link
          to="/consultations"
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center space-x-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Consultation & Patient</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name or WhatsApp phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading patient records...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((patient) => (
              <div
                key={patient._id}
                className="py-3.5 px-2 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 text-slate-700 font-bold text-sm h-10 w-10 rounded-full flex items-center justify-center">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm text-gray-900">{patient.name}</h4>
                      {patient.isSeeded && (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded">
                          OpenMRS Seed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{patient.phoneWhatsapp} • {patient.gender || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-1.5 bg-gray-100 px-2.5 py-1 rounded-md text-xs text-gray-700">
                    <Globe className="w-3.5 h-3.5 text-brand-600" />
                    <span className="uppercase font-mono text-[11px] font-bold">{patient.language}</span>
                  </div>

                  <Link
                    to={`/patients/${patient._id}`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
                  >
                    <span>View Record</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
