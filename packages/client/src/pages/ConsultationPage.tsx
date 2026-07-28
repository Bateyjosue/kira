import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Stethoscope } from 'lucide-react';

export const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('Keza Marie Uwase');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('+250789000111');
  const [language, setLanguage] = useState('rw');
  const [diagnosis, setDiagnosis] = useState('Uncomplicated Plasmodium falciparum Malaria');
  const [medications, setMedications] = useState([
    { name: 'Coartem (Artemether/Lumefantrine)', dosage: '20/120mg', frequency: '2 tabs twice daily', duration: '3 days' },
  ]);
  const [notes, setNotes] = useState('Patient presented with fever, chills and muscle weakness.');
  const [loading, setLoading] = useState(false);

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleMedChange = (index: number, field: string, value: string) => {
    const updated = [...medications];
    (updated[index] as any)[field] = value;
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Patient
      const patRes = await api.post('/patients', {
        name: patientName,
        phoneWhatsapp,
        language,
      });

      // 2. Create Consultation
      await api.post('/consultations', {
        patientId: patRes.data._id,
        diagnosis,
        medications,
        notes,
        followUpScheduleDays: [1, 3, 7],
      });

      toast.success('Consultation created & WhatsApp check-ins scheduled!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create consultation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">New Patient Consultation</h2>
        <p className="text-xs text-gray-500">Record diagnosis and start automated WhatsApp follow-ups</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Patient Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Phone Number</label>
              <input
                type="text"
                required
                value={phoneWhatsapp}
                onChange={(e) => setPhoneWhatsapp(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="rw">Kinyarwanda (rw)</option>
                <option value="en">English (en)</option>
                <option value="fr">French (fr)</option>
                <option value="sw">Swahili (sw)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Diagnosis & Clinical Notes</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Diagnosis</label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Clinical Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-sm text-gray-800">Prescribed Medications</h3>
            <button
              type="button"
              onClick={addMedication}
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication</span>
            </button>
          </div>

          {medications.map((m, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <input
                type="text"
                placeholder="Medication Name"
                value={m.name}
                onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                className="bg-white border border-gray-200 rounded p-1.5 text-xs"
              />
              <input
                type="text"
                placeholder="Dosage (e.g. 20mg)"
                value={m.dosage}
                onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                className="bg-white border border-gray-200 rounded p-1.5 text-xs"
              />
              <input
                type="text"
                placeholder="Frequency (e.g. Twice daily)"
                value={m.frequency}
                onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                className="bg-white border border-gray-200 rounded p-1.5 text-xs"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 3 days)"
                value={m.duration}
                onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                className="bg-white border border-gray-200 rounded p-1.5 text-xs"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 shadow-md shadow-brand-500/20 disabled:opacity-50"
        >
          <Stethoscope className="w-4 h-4" />
          <span>{loading ? 'Creating Consultation...' : 'Register Consultation & Schedule AI Follow-Ups'}</span>
        </button>
      </form>
    </div>
  );
};
