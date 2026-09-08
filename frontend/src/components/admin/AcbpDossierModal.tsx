/* Hallmark · component: AcbpDossierModal · genre: modern-minimal · theme: Cobalt/Gov */
/* states: default · hover · focus · active */
/* contrast: pass (WCAG AA 4.5:1+) */

import React, { useState, useEffect } from 'react';
import { X, Printer, Download, CheckCircle2, Landmark, ShieldCheck, Building2, BookOpen } from 'lucide-react';
import { IndianFlag } from '../ui/IndianFlag';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';
import { apiUrl } from '../../lib/api';

export interface AcbpDossierData {
  documentId: string;
  ministry: string;
  authority: string;
  generatedAt: string;
  fiscalYear: string;
  executiveSummary: {
    totalStatisticalCadreTracked: number;
    overallSystemReadiness: string;
    acbpFulfillmentRate: string;
    status: string;
  };
  divisionAllocations: Array<{
    divisionName: string;
    officersCovered: number;
    readinessLevel: string;
    identifiedGaps: string[];
    recommendedInterventions: Array<{
      courseId: string;
      title: string;
      provider: string;
      targetOfficers: number;
      duration: string;
    }>;
  }>;
  regionalBreakdown: Array<{
    circle: string;
    headcount: number;
    readiness: string;
  }>;
  mandates: string[];
}

interface AcbpDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AcbpDossierModal({ isOpen, onClose }: AcbpDossierModalProps) {
  const dialogRef = useDialogAccessibility(isOpen, onClose);
  const [dossier, setDossier] = useState<AcbpDossierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(apiUrl('/api/admin/acbp-dossier'), { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && data.dossier) {
          setDossier(data.dossier);
        } else {
          throw new Error('Dossier payload missing from server response');
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('ACBP Dossier fetch failed:', err);
          setError('The ACBP dossier service is unavailable. No sample allocations are being substituted.');
          setDossier(null);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = () => {
    if (!dossier) return;
    navigator.clipboard.writeText(JSON.stringify(dossier, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="acbp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto font-body"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Prototype dossier header */}
        <div className="bg-[#0B2E63] text-white px-6 py-4 flex items-center justify-between border-b border-[#123E82]">
          <div className="flex items-center gap-3">
            <IndianFlag variant="circular" width={36} height={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                  Prototype Capacity Building Plan (ACBP)
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-200 text-[11px]">Dossier preview</span>
              </div>
              <h2 id="acbp-modal-title" className="text-base font-bold text-white font-display">
                MoSPI Annual Capacity Building Plan 2026-2027
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close ACBP Dossier"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer active:translate-y-[1px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tricolour Ribbon */}
        <div
          className="h-[3px] w-full"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(90deg, #F5811F 0%, #F5811F 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #1E8449 66.6%, #1E8449 100%)',
          }}
        />

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-slate-900">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#0B2E63] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600 font-body">
                Loading ACBP dossier from the connected data service…
              </p>
            </div>
          ) : error && !dossier ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-900">
              <p className="font-bold text-sm">{error}</p>
            </div>
          ) : dossier ? (
            <div className="space-y-6 text-sm">
              {/* Official Header Meta */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Document ID</span>
                    <p className="text-base font-bold text-[#0B2E63] font-mono">{dossier.documentId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Fiscal Year</span>
                    <p className="text-sm font-semibold text-slate-800 font-mono">{dossier.fiscalYear}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">Issuing Ministry:</span> {dossier.ministry}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Audit Authority:</span> {dossier.authority}
                  </div>
                </div>
              </div>

              {/* Executive Summary Cards */}
              <div>
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 font-display">
                  Executive Competency Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4">
                    <div className="text-xs font-bold text-[#0B2E63] font-display">Total Cadre Covered</div>
                    <div className="text-2xl font-bold text-[#0B2E63] mt-1 font-display">
                      {dossier.executiveSummary.totalStatisticalCadreTracked.toLocaleString('en-IN')} Officers
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 font-body">SSS & ISS Cadres Combined</div>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4">
                    <div className="text-xs font-bold text-emerald-950 font-display">Overall System Readiness</div>
                    <div className="text-2xl font-bold text-emerald-800 mt-1 font-display">
                      {dossier.executiveSummary.overallSystemReadiness}
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-1 font-body">Target Benchmark: 75.0%</div>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
                    <div className="text-xs font-bold text-amber-950 font-display">ACBP Fulfillment Rate</div>
                    <div className="text-2xl font-bold text-amber-800 mt-1 font-display">
                      {dossier.executiveSummary.acbpFulfillmentRate}
                    </div>
                    <div className="text-[11px] text-amber-700 mt-1 font-body">CBC Compliance Rating: High</div>
                  </div>
                </div>
              </div>

              {/* Division-wise Interventions */}
              <div>
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 font-display">
                  Division-Wise Capacity Building Allocations
                </h3>
                <div className="space-y-4">
                  {dossier.divisionAllocations.map((div, i) => (
                    <div key={i} className="border border-slate-200/90 rounded-xl p-4 bg-white space-y-3 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#0B2E63]" />
                          <h4 className="font-bold text-slate-900 text-sm font-display">{div.divisionName}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="neutral">{div.officersCovered} Officers</Badge>
                          <Badge variant={parseFloat(div.readinessLevel) >= 80 ? 'default' : 'saffron'}>
                            {div.readinessLevel} Readiness
                          </Badge>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900 font-display">Identified Competency Gaps:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 font-body">
                          {div.identifiedGaps.map((gap, gIdx) => (
                            <li key={gIdx}>{gap}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-200/70">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block font-mono">
                          Mandated iGOT / NSSTA Interventions
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {div.recommendedInterventions.map((c, cIdx) => (
                            <div
                              key={cIdx}
                              className="bg-white border border-slate-200/90 rounded-md p-2.5 text-xs flex items-start gap-2 shadow-xs"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-bold text-slate-900 font-display">{c.title}</div>
                                <div className="text-[11px] text-slate-500 font-body">
                                  {c.provider} • {c.duration} • {c.targetOfficers} Officers Mandated
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Circles Breakdown */}
              <div>
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 font-display">
                  Regional Circles Distribution
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(dossier.regionalBreakdown || (dossier as any).regionalEquity || []).map((r: any, i: number) => (
                    <div key={i} className="border border-slate-200/90 rounded-lg p-3 bg-white space-y-1 shadow-xs">
                      <div className="font-bold text-xs text-slate-900 font-display">{r.circle}</div>
                      <div className="flex items-center justify-between text-xs text-slate-600 font-body">
                        <span>{r.headcount} Officers</span>
                        <span className="font-bold text-emerald-700 font-mono">
                          {typeof r.readiness === 'number' ? `${r.readiness}%` : r.readiness}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Directives */}
              <div className="bg-amber-50/60 border border-amber-200/90 rounded-xl p-4 text-xs text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 font-display">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Statutory Capacity Building Mandates (Mission Karmayogi 2026)
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1 font-body">
                  {dossier.mandates?.length ? (
                    dossier.mandates.map((mandate, mandateIndex) => (
                      <li key={mandateIndex}>{mandate}</li>
                    ))
                  ) : (
                    <li>No policy directives were included in the connected service response.</li>
                  )}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200/90 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-body">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Prototype export from the connected data service · Not an official signed record
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={handleCopyJson}>
              <Download className="w-3.5 h-3.5 mr-1" />
              {copied ? 'Copied JSON!' : 'Copy CBC JSON'}
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print / Save PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

