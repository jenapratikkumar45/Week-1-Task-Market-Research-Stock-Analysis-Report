import React, { useState } from "react";
import { CompanyAnalysis } from "../types";
import { Building2, Info, Landmark, Shield, Lightbulb, TrendingUp } from "lucide-react";

interface CompanyProfilesProps {
  companies: CompanyAnalysis[];
  onChange: (updatedCompanies: CompanyAnalysis[]) => void;
}

export default function CompanyProfiles({ companies, onChange }: CompanyProfilesProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  if (!companies || companies.length === 0) {
    return null;
  }

  const activeCompany = companies[activeIdx] || companies[0];

  const updateActiveCompanyField = (key: keyof CompanyAnalysis, val: any) => {
    const updated = companies.map((co, idx) => {
      if (idx === activeIdx) {
        return { ...co, [key]: val };
      }
      return co;
    });
    onChange(updated);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6" id="company-profiles-editor">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans text-lg font-bold text-slate-900">Section 2: Company-Level Analysis & Sector Equity Profiling</h2>
            <p className="text-xs text-slate-500">Perform deep audits on financial performance, moats, and earnings vectors</p>
          </div>
        </div>
        
        {/* Company Selection Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
          {companies.map((co, idx) => (
            <button
              key={co.ticker}
              onClick={() => setActiveIdx(idx)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                idx === activeIdx
                  ? "bg-white text-slate-900 border border-slate-200/50 shadow-xs"
                  : "text-slate-500 hover:text-slate-950"
              }`}
            >
              {co.ticker}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Header Summary Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Name</span>
            <input
              type="text"
              value={activeCompany.name}
              onChange={(e) => updateActiveCompanyField("name", e.target.value)}
              className="text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 py-0.5 w-full rounded outline-hidden"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sector Designation</span>
            <input
              type="text"
              value={activeCompany.sector}
              onChange={(e) => updateActiveCompanyField("sector", e.target.value)}
              className="text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 py-0.5 w-full rounded outline-hidden"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">P/E Ratio</span>
              <input
                type="number"
                step="0.1"
                value={activeCompany.peRatio}
                onChange={(e) => updateActiveCompanyField("peRatio", parseFloat(e.target.value) || 0)}
                className="text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 py-0.5 w-full rounded outline-hidden"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">YoY Rev Growth</span>
              <input
                type="text"
                value={activeCompany.revenueGrowth}
                onChange={(e) => updateActiveCompanyField("revenueGrowth", e.target.value)}
                className="text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 py-0.5 w-full rounded outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Detailed Description Fields */}
        <div className="space-y-4">
          {/* Company Profile */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-500" />
              Corporate Identity & Core Business Model
            </span>
            <textarea
              value={activeCompany.profile}
              onChange={(e) => updateActiveCompanyField("profile", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm text-slate-700 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg focus:ring-1 focus:ring-indigo-100 transition-all outline-hidden leading-relaxed"
            />
          </div>

          {/* Earnings & Revenue Analysis */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-500" />
              Financial Audit & Recent Earnings Performance
            </span>
            <textarea
              value={activeCompany.earnings}
              onChange={(e) => updateActiveCompanyField("earnings", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm text-slate-700 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg focus:ring-1 focus:ring-indigo-100 transition-all outline-hidden leading-relaxed"
            />
          </div>

          {/* Competitive Positioning (Moat) */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-500" />
              Strategic Moat & Competitive Advantages
            </span>
            <textarea
              value={activeCompany.competitivePositioning}
              onChange={(e) => updateActiveCompanyField("competitivePositioning", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm text-slate-700 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg focus:ring-1 focus:ring-indigo-100 transition-all outline-hidden leading-relaxed"
            />
          </div>

          {/* Potential Growth */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-purple-500" />
              Key Catalysts, Growth Pipeline & Potential Risks
            </span>
            <textarea
              value={activeCompany.potentialGrowth}
              onChange={(e) => updateActiveCompanyField("potentialGrowth", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm text-slate-700 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg focus:ring-1 focus:ring-indigo-100 transition-all outline-hidden leading-relaxed"
            />
          </div>

          {/* Stock Performance details */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Stock Trading Performance & Analyst Consensus
            </span>
            <textarea
              value={activeCompany.stockPerformance}
              onChange={(e) => updateActiveCompanyField("stockPerformance", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm text-slate-700 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg focus:ring-1 focus:ring-indigo-100 transition-all outline-hidden leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
