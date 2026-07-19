import React from "react";
import { ConclusiveInsights } from "../types";
import { Award, Plus, Trash2, CheckCircle2, ListFilter } from "lucide-react";

interface ConclusiveInsightsCompProps {
  data: ConclusiveInsights;
  onChange: (updated: ConclusiveInsights) => void;
}

export default function ConclusiveInsightsComp({ data, onChange }: ConclusiveInsightsCompProps) {
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...data, summary: e.target.value });
  };

  const handleRecChange = (index: number, val: string) => {
    const updatedRecs = [...data.recommendations];
    updatedRecs[index] = val;
    onChange({ ...data, recommendations: updatedRecs });
  };

  const addRec = () => {
    onChange({ ...data, recommendations: [...data.recommendations, "New tracking/investment recommendation..."] });
  };

  const deleteRec = (index: number) => {
    const updatedRecs = data.recommendations.filter((_, idx) => idx !== index);
    onChange({ ...data, recommendations: updatedRecs });
  };

  const handleHypothesisChange = (index: number, val: string) => {
    const updatedHypotheses = [...data.investmentHypotheses];
    updatedHypotheses[index] = val;
    onChange({ ...data, investmentHypotheses: updatedHypotheses });
  };

  const addHypothesis = () => {
    onChange({ ...data, investmentHypotheses: [...data.investmentHypotheses, "Hypothesis X: If catalyst occurs, then valuation will adjust by..."] });
  };

  const deleteHypothesis = (index: number) => {
    const updatedHypotheses = data.investmentHypotheses.filter((_, idx) => idx !== index);
    onChange({ ...data, investmentHypotheses: updatedHypotheses });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6" id="conclusive-insights-editor">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-sans text-lg font-bold text-slate-900">Section 3: Conclusive Insights & Strategic Investment Hypotheses</h2>
          <p className="text-xs text-slate-500">Formulate testable hypotheses and formal tracking guidelines for the equity watchlists</p>
        </div>
      </div>

      {/* AI Insight Highlight */}
      {data.aiInsightSummary && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3">
          <div className="mt-0.5 p-1.5 bg-indigo-600 text-white rounded-md shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1">AI Analyst Insight</h4>
            <p className="text-sm text-indigo-900 font-medium leading-snug">{data.aiInsightSummary}</p>
          </div>
        </div>
      )}

      {/* Synthesis Executive Summary */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Executive Research Summary & Analyst Synthesis
        </label>
        <textarea
          value={data.summary}
          onChange={handleSummaryChange}
          rows={5}
          className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-100 transition-all outline-hidden leading-relaxed"
          placeholder="Summarize the composite findings of your sector research..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Watchlist Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Tracking Guidelines & Watchlists
            </span>
            <button
              onClick={addRec}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Guideline
            </button>
          </div>

          <div className="space-y-2">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-2 group">
                <input
                  type="text"
                  value={rec}
                  onChange={(e) => handleRecChange(idx, e.target.value)}
                  className="flex-1 px-3 py-2 text-xs text-slate-700 bg-slate-50 focus:bg-white border border-slate-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-hidden transition-all"
                  placeholder="Enter tracking recommendation..."
                />
                <button
                  onClick={() => deleteRec(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                  title="Delete recommendation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {data.recommendations.length === 0 && (
              <p className="text-xs text-slate-400 italic">No recommendations declared. Click 'Add Guideline' to begin.</p>
            )}
          </div>
        </div>

        {/* Investment Hypotheses */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-purple-600" />
              testable Investment Hypotheses
            </span>
            <button
              onClick={addHypothesis}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Hypothesis
            </button>
          </div>

          <div className="space-y-2">
            {data.investmentHypotheses.map((hyp, idx) => (
              <div key={idx} className="flex gap-2 group">
                <textarea
                  value={hyp}
                  onChange={(e) => handleHypothesisChange(idx, e.target.value)}
                  rows={2}
                  className="flex-1 px-3 py-2 text-xs text-slate-700 bg-slate-50 focus:bg-white border border-slate-200 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-100 outline-hidden transition-all resize-none"
                  placeholder="Enter investment hypothesis..."
                />
                <button
                  onClick={() => deleteHypothesis(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all self-start"
                  title="Delete hypothesis"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {data.investmentHypotheses.length === 0 && (
              <p className="text-xs text-slate-400 italic">No hypotheses declared. Click 'Add Hypothesis' to begin.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
