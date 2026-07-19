import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";
import { CompanyAnalysis } from "../types";
import { BarChart3, LineChart as LineIcon, TrendingUp } from "lucide-react";

interface FinancialChartsProps {
  companies: CompanyAnalysis[];
}

export default function FinancialCharts({ companies }: FinancialChartsProps) {
  const [activeTab, setActiveTab] = useState<"performance" | "valuation" | "growth">("performance");
  const [selectedTicker, setSelectedTicker] = useState<string>("ALL");

  if (!companies || companies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-slate-200 rounded-xl" id="charts-no-data">
        <p className="text-sm text-slate-500">No financial visualization data available.</p>
      </div>
    );
  }

  // Get color for a stock
  const getStockColor = (ticker: string, index: number) => {
    const colors = ["#1e3a8a", "#0f766e", "#e11d48", "#d97706", "#7c3aed"];
    return colors[index % colors.length];
  };

  // Prepare Comparative Stock Price Data
  // We assume all selected stocks have exactly the same dates (from historicalData)
  const months = companies[0]?.historicalData.map(d => d.date) || [];
  
  const comparativePriceData = months.map((month, mIdx) => {
    const dataPoint: any = { name: month };
    companies.forEach((co, cIdx) => {
      const coMonthData = co.historicalData.find(hd => hd.date === month) || co.historicalData[mIdx];
      if (coMonthData) {
        dataPoint[co.ticker] = coMonthData.price;
      }
    });
    return dataPoint;
  });

  // Prepare Valuation P/E Data
  const peData = companies.map((co, idx) => ({
    name: `${co.name} (${co.ticker})`,
    pe: co.peRatio,
    ticker: co.ticker,
    fill: getStockColor(co.ticker, idx)
  }));

  // Prepare Revenue Growth Rates
  const growthData = companies.map((co, idx) => {
    // Extract numerical rate
    const parsedRate = parseFloat(co.revenueGrowth.replace(/[^0-9.-]/g, "")) || 0;
    return {
      name: `${co.name} (${co.ticker})`,
      growth: parsedRate,
      ticker: co.ticker,
      fill: getStockColor(co.ticker, idx)
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="financial-visualizations">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h3 className="font-sans text-lg font-semibold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Financial Market Visualizations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Interactive performance and valuation metrics compared side-by-side</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg mt-3 sm:mt-0 self-start">
          <button
            onClick={() => setActiveTab("performance")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "performance"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            id="tab-chart-perf"
          >
            <LineIcon className="w-3.5 h-3.5" />
            Stock Performance
          </button>
          <button
            onClick={() => setActiveTab("valuation")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "valuation"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            id="tab-chart-val"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            P/E Valuations
          </button>
          <button
            onClick={() => setActiveTab("growth")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "growth"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            id="tab-chart-growth"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Revenue Growth Rates
          </button>
        </div>
      </div>

      {activeTab === "performance" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium mr-2">Compare:</span>
            <button
              onClick={() => setSelectedTicker("ALL")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
                selectedTicker === "ALL"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Selected Stocks
            </button>
            {companies.map((co, cIdx) => (
              <button
                key={co.ticker}
                onClick={() => setSelectedTicker(co.ticker)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all flex items-center gap-1.5 ${
                  selectedTicker === co.ticker
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStockColor(co.ticker, cIdx) }}
                />
                {co.ticker}
              </button>
            ))}
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparativePriceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#f8fafc" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                
                {companies.map((co, cIdx) => {
                  const isVisible = selectedTicker === "ALL" || selectedTicker === co.ticker;
                  return (
                    <Line
                      key={co.ticker}
                      type="monotone"
                      dataKey={co.ticker}
                      name={`${co.ticker} (USD)`}
                      stroke={getStockColor(co.ticker, cIdx)}
                      strokeWidth={selectedTicker === co.ticker ? 3 : 2}
                      dot={selectedTicker === co.ticker ? { r: 5 } : { r: 3 }}
                      activeDot={{ r: 6 }}
                      opacity={isVisible ? 1 : 0.15}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 italic text-center">Historical trailing 12-month closing price trend index (July 2025 – July 2026)</p>
        </div>
      )}

      {activeTab === "valuation" && (
        <div className="space-y-4">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ticker" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} label={{ value: "P/E Ratio", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#f8fafc" }}
                  formatter={(value) => [`${value}x`, "Price-to-Earnings"]}
                />
                <Bar dataKey="pe" name="Trailing P/E Ratio" radius={[6, 6, 0, 0]}>
                  {peData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {companies.map((co, idx) => (
              <div key={co.ticker} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{co.ticker}</span>
                <span className="text-xl font-bold text-slate-800">{co.peRatio}x</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">P/E Ratio</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "growth" && (
        <div className="space-y-4">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ticker" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} label={{ value: "Growth Rate (%)", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#f8fafc" }}
                  formatter={(value) => [`${value}%`, "YoY Revenue Growth"]}
                />
                <Bar dataKey="growth" name="Revenue Growth (%)" radius={[6, 6, 0, 0]}>
                  {growthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {companies.map((co, idx) => (
              <div key={co.ticker} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{co.ticker}</span>
                <span className="text-xl font-bold text-emerald-600">{co.revenueGrowth}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Revenue Growth</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
