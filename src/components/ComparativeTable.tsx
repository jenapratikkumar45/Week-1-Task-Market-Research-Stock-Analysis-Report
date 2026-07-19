import React from "react";
import { CompanyAnalysis } from "../types";

interface ComparativeTableProps {
  companies: CompanyAnalysis[];
}

export default function ComparativeTable({ companies }: ComparativeTableProps) {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">Comparative Metrics Auto-Fill Table</h4>
        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">Dynamic</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest">
              <th className="p-3 border-b border-slate-200 font-semibold">Ticker</th>
              <th className="p-3 border-b border-slate-200 font-semibold">Company Name</th>
              <th className="p-3 border-b border-slate-200 font-semibold">Sector</th>
              <th className="p-3 border-b border-slate-200 font-semibold text-right">Trailing P/E</th>
              <th className="p-3 border-b border-slate-200 font-semibold text-right">Revenue Growth</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-700">
            {companies.map((co, idx) => (
              <tr key={co.ticker} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                <td className="p-3 border-b border-slate-100 font-bold text-indigo-600">{co.ticker}</td>
                <td className="p-3 border-b border-slate-100 font-semibold">{co.name}</td>
                <td className="p-3 border-b border-slate-100">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">{co.sector}</span>
                </td>
                <td className="p-3 border-b border-slate-100 text-right font-mono font-medium">{co.peRatio}x</td>
                <td className="p-3 border-b border-slate-100 text-right font-mono font-medium text-emerald-600">{co.revenueGrowth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
