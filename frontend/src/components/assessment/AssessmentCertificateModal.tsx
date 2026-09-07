import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IndianFlag } from '../ui/IndianFlag';
import {
  Award,
  CheckCircle2,
  Printer,
  X,
  ShieldCheck,
  Calendar,
  Clock,
  FileText,
  Share2,
} from 'lucide-react';

export interface AssessmentCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  officerName: string;
  cadre: string;
  division: string;
  scorePercentage: number;
  paperSet: string;
  timeTakenSeconds: number;
  assessmentTopic?: string;
  dateString?: string;
  verificationHash?: string;
}

export const AssessmentCertificateModal: React.FC<AssessmentCertificateModalProps> = ({
  isOpen,
  onClose,
  officerName,
  cadre,
  division,
  scorePercentage,
  paperSet,
  timeTakenSeconds,
  assessmentTopic = 'Sampling Design & Official Statistics Competencies',
  dateString = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  verificationHash = 'SHA256-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const minutesTaken = Math.floor(timeTakenSeconds / 60);
  const secondsTaken = timeTakenSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-body animate-fade-in print:p-0 print:bg-white print:static" role="dialog" aria-modal="true" aria-labelledby="cert-title">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 print:border-0 print:shadow-none print:max-w-none">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#0B2E63]" />
            <span className="text-xs font-bold text-slate-800">
              Official MoSPI Competency Assessment Certificate & Dossier
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-bold bg-[#0B2E63] text-white hover:bg-[#123E82] flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 cursor-pointer"
              aria-label="Close certificate modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Page */}
        <div id="printable-certificate" className="p-8 sm:p-10 border-8 border-double border-[#0B2E63]/20 bg-[radial-gradient(#f8fafc_1px,transparent_1px)] [background-size:16px_16px] text-slate-900 space-y-6 relative">
          {/* Saffron and Green Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-2 bg-[#D96B07]" />
          <div className="absolute top-0 right-0 w-16 h-2 bg-[#155C33]" />
          <div className="absolute bottom-0 left-0 w-16 h-2 bg-[#155C33]" />
          <div className="absolute bottom-0 right-0 w-16 h-2 bg-[#D96B07]" />

          {/* Certificate Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <IndianFlag variant="circular" width={48} height={48} />
            </div>
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest font-mono">
              Government of India · Ministry of Statistics and Programme Implementation
            </div>
            <h1 id="cert-title" className="text-2xl sm:text-3xl font-black font-display text-[#0B2E63] tracking-tight uppercase">
              Competency Assessment Dossier
            </h1>
            <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
              Mission Karmayogi · National Programme for Civil Services Capacity Building (NPCSCB)
            </p>
          </div>

          {/* Officer Details Box */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
            <div className="text-center">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">This is to certify that</span>
              <h2 className="text-xl font-bold font-display text-slate-900 mt-0.5">
                {officerName}
              </h2>
              <p className="text-xs font-semibold text-[#0B2E63] mt-0.5">
                {cadre} — {division}
              </p>
            </div>

            <div className="text-center text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
              has successfully completed the grounded active-recall competency evaluation in <strong className="text-slate-900 font-display">{assessmentTopic}</strong>, demonstrating proficiency aligned with the MoSPI Framework for Roles, Activities and Competencies (FRAC).
            </div>

            {/* Assessment Metrics Table */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Score Achieved</span>
                <span className="text-lg font-black text-emerald-700 font-display">{scorePercentage}%</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Paper Version</span>
                <span className="text-lg font-bold text-[#0B2E63] font-mono">{paperSet}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Time Invested</span>
                <span className="text-lg font-bold text-slate-800 font-mono">{minutesTaken}m {secondsTaken}s</span>
              </div>
            </div>
          </div>

          {/* Signatures & Cryptographic Proof */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verification Code: {verificationHash}</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Issued on: <strong className="text-slate-700">{dateString}</strong>
              </p>
            </div>

            <div className="text-center sm:text-right">
              <div className="w-36 border-b border-slate-400 pb-1 mx-auto sm:ml-auto">
                <span className="font-serif italic text-xs font-bold text-[#0B2E63]">MoSPI CBC Council</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5 block">
                Authorized Signatory, CBC MoSPI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
