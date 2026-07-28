import React, { useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { Send, Phone } from 'lucide-react';

interface WhatsAppSimulatorProps {
  patients: { _id: string; name: string; phoneWhatsapp: string }[];
  onResponseProcessed?: () => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({ patients, onResponseProcessed }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?._id || '');
  const [replyMessage, setReplyMessage] = useState<string>('Ndomva ntaba nina, umuriro watumbagaye mu ijoro.');
  const [loading, setLoading] = useState(false);

  const handleSendSimulatedReply = async () => {
    if (!selectedPatientId || !replyMessage.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/whatsapp/webhook', {
        patientId: selectedPatientId,
        messageText: replyMessage,
      });

      if (res.data.analysis?.hasRedFlag) {
        toast.error(`🔴 AI Flagged Red Flag: ${res.data.analysis.aiSummary}`);
      } else {
        toast.success(`✅ AI Processed Reply: ${res.data.analysis?.aiSummary || 'Response logged'}`);
      }

      setReplyMessage('');
      if (onResponseProcessed) onResponseProcessed();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
          <Phone className="w-4 h-4" />
          <span>Interactive WhatsApp Sandbox</span>
        </div>
        <span className="text-[11px] bg-emerald-950 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-800">
          Live AI Engine
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Patient</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.phoneWhatsapp})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Simulated Patient WhatsApp Reply</label>
          <textarea
            rows={3}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type patient response (e.g., 'Fever is gone' or 'Chest pain worsening')..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <button
          onClick={handleSendSimulatedReply}
          disabled={loading || !selectedPatientId}
          className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? 'Analyzing with Gemini...' : 'Send Simulated Reply'}</span>
        </button>
      </div>
    </div>
  );
};
