import React from "react";
import { MarketOverview } from "../types";
import { Globe, Plus, Trash2, ShieldAlert, Sparkles } from "lucide-react";

interface MarketOverviewCompProps {
  data: MarketOverview;
  onChange: (updated: MarketOverview) => void;
}

export default function MarketOverviewComp({ data, onChange }: MarketOverviewCompProps) {
  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...data, economicContext: e.target.value });
  };

  const handleDriverChange = (index: number, val: string) => {
    const updatedDrivers = [...data.majorDrivers];
    updatedDrivers[index] = val;
    onChange({ ...data, majorDrivers: updatedDrivers });
  };

  const addDriver = () => {
    onChange({ ...data, majorDrivers: [...data.majorDrivers, "New market driver..."] });
  };

  const deleteDriver = (index: number) => {
    const updatedDrivers = data.majorDrivers.filter((_, idx) => idx !== index);
    onChange({ ...data, majorDrivers: updatedDrivers });
  };

  const handleRiskChange = (index: number, val: string) => {
    const updatedRisks = [...data.risks];
    updatedRisks[index] = val;
    onChange({ ...data, risks: updatedRisks });
  };

  const addRisk = () => {
    onChange({ ...data, risks: [...data.risks, "New systematic market risk..."] });
  };

  const deleteRisk = (index: number) => {
    const updatedRisks = data.risks.filter((_, idx) => idx !== index);
    onChange({ ...data, risks: updatedRisks });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6" id="market-overview-editor">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-sans text-lg font-bold text-slate-900">Section 1: Market Overview & Macroeconomic Context</h2>
          <p className="text-xs text-slate-500">Analyze overall economic conditions, growth drivers, and threat vectors</p>
        </div>
      </div>

      {/* Economic Context */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Macroeconomic & Monetary Policy Context
        </label>
        <textarea
          value={data.economicContext}
          onChange={handleContextChange}
          rows={6}
          className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-100 transition-all outline-hidden leading-relaxed"
          placeholder="Describe the current macroeconomic climate, inflation, central bank policy, interest rates..."
        />
      </div>

      {/* Major Drivers & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drivers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Primary Structural Drivers
            </span>
            <button
              onClick={addDriver}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Driver
            </button>
          </div>

          <div className="space-y-2">
            {data.majorDrivers.map((driver, idx) => (
              <div key={idx} className="flex gap-2 group">
                <input
                  type="text"
                  value={driver}
                  onChange={(e) => handleDriverChange(idx, e.target.value)}
                  className="flex-1 px-3 py-2 text-xs text-slate-700 bg-slate-50 focus:bg-white border border-slate-200 rounded-md focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100 outline-hidden transition-all"
                  placeholder="Enter structural driver..."
                />
                <button
                  onClick={() => deleteDriver(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                  title="Delete driver"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {data.majorDrivers.length === 0 && (
              <p className="text-xs text-slate-400 italic">No market drivers declared. Click 'Add Driver' to begin.</p>
            )}
          </div>
        </div>

        {/* Risks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Systemic & Systematic Risks
            </span>
            <button
              onClick={addRisk}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Risk
            </button>
          </div>

          <div className="space-y-2">
            {data.risks.map((risk, idx) => (
              <div key={idx} className="flex gap-2 group">
                <input
                  type="text"
                  value={risk}
                  onChange={(e) => handleRiskChange(idx, e.target.value)}
                  className="flex-1 px-3 py-2 text-xs text-slate-700 bg-slate-50 focus:bg-white border border-slate-200 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-100 outline-hidden transition-all"
                  placeholder="Enter market risk..."
                />
                <button
                  onClick={() => deleteRisk(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                  title="Delete risk"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {data.risks.length === 0 && (
              <p className="text-xs text-slate-400 italic">No market risks declared. Click 'Add Risk' to begin.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
