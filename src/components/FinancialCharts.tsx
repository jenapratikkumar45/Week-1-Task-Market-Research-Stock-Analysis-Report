import React, { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
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
  Cell,
  ReferenceLine
} from "recharts";
import { CompanyAnalysis } from "../types";
import { BarChart3, LineChart as LineIcon, TrendingUp, Camera, LayoutGrid } from "lucide-react";

interface FinancialChartsProps {
  companies: CompanyAnalysis[];
}

export default function FinancialCharts({ companies }: FinancialChartsProps) {
  const [activeTab, setActiveTab] = useState<"performance" | "valuation" | "growth" | "heatmap">("performance");
  const [selectedTicker, setSelectedTicker] = useState<string>("ALL");
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportImage = useCallback(() => {
    if (chartRef.current === null) {
      return;
    }
    
    // Add a temporary style to ensure the background is white for export
    const originalBg = chartRef.current.style.backgroundColor;
    chartRef.current.style.backgroundColor = "#ffffff";
    
    toPng(chartRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `financial_chart_${activeTab}_${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
        
        // Restore background
        if (chartRef.current) {
           chartRef.current.style.backgroundColor = originalBg;
        }
      })
      .catch((err) => {
        console.error("Failed to export chart image", err);
        if (chartRef.current) {
           chartRef.current.style.backgroundColor = originalBg;
        }
      });
  }, [activeTab, chartRef]);

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
  
  let overallMinPrice = Infinity;
  let overallMaxPrice = -Infinity;

  const comparativePriceData = months.map((month, mIdx) => {
    const dataPoint: any = { name: month };
    let totalValue = 0;
    let count = 0;
    
    companies.forEach((co, cIdx) => {
      const coMonthData = co.historicalData.find(hd => hd.date === month) || co.historicalData[mIdx];
      if (coMonthData) {
        dataPoint[co.ticker] = coMonthData.price;
        totalValue += coMonthData.price;
        count++;
        
        if (coMonthData.price < overallMinPrice) overallMinPrice = coMonthData.price;
        if (coMonthData.price > overallMaxPrice) overallMaxPrice = coMonthData.price;
      }
    });
    
    // Sector Benchmark Simulation (Average of selected)
    if (count > 0) {
      dataPoint["Sector Benchmark"] = parseFloat((totalValue / count).toFixed(2));
    }
    
    return dataPoint;
  });

  // Calculate Average P/E for Benchmark Annotation
  const avgPe = companies.reduce((sum, co) => sum + co.peRatio, 0) / (companies.length || 1);
  const avgGrowth = companies.reduce((sum, co) => {
    const rate = parseFloat(co.revenueGrowth.replace(/[^0-9.-]/g, "")) || 0;
    return sum + rate;
  }, 0) / (companies.length || 1);

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
          <button
            onClick={() => setActiveTab("heatmap")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "heatmap"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            id="tab-chart-heatmap"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            MoM Heatmap
          </button>
          
          <div className="w-px h-5 bg-slate-300 mx-1 self-center hidden sm:block"></div>
          
          <button
            onClick={handleExportImage}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-all ml-1"
            title="Export chart as image"
          >
            <Camera className="w-3.5 h-3.5" />
            Export PNG
          </button>
        </div>
      </div>

      <div ref={chartRef} className="p-2 -m-2 rounded-lg">
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
            <div className="ml-auto text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-medium">
              Sector Benchmark (Dashed) Enabled
            </div>
          </div>

          <div className="h-72 w-full mt-2" style={{ minHeight: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparativePriceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  domain={[(dataMin: number) => Math.floor(dataMin * 0.95), (dataMax: number) => Math.ceil(dataMax * 1.05)]} 
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#f8fafc" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                
                {/* Sector Benchmark Line */}
                <Line
                  type="monotone"
                  dataKey="Sector Benchmark"
                  name="Sector Avg Index"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 4 }}
                  opacity={selectedTicker === "ALL" ? 0.6 : 0.2}
                />

                
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
          <div className="h-72 w-full" style={{ minHeight: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ticker" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  domain={[0, 'dataMax + 10']}
                  label={{ value: "P/E Ratio", angle: -90, position: "insideLeft", fontSize: 10 }} 
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#f8fafc" }}
                  formatter={(value) => [`${value}x`, "Price-to-Earnings"]}
                />
                
                {/* Average Benchmark Annotation */}
                <ReferenceLine 
                  y={avgPe} 
                  stroke="#f59e0b" 
                  strokeDasharray="4 4" 
                  label={{ position: 'top', value: `Avg: ${avgPe.toFixed(1)}x`, fill: '#f59e0b', fontSize: 10, fontWeight: 600 }} 
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
          <div className="h-72 w-full" style={{ minHeight: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ticker" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  domain={[0, 'dataMax + 5']}
                  label={{ value: "Growth Rate (%)", angle: -90, position: "insideLeft", fontSize: 10 }} 
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none", color: "#f8fafc" }}
                  formatter={(value) => [`${value}%`, "YoY Revenue Growth"]}
                />
                
                {/* Average Growth Annotation */}
                <ReferenceLine 
                  y={avgGrowth} 
                  stroke="#10b981" 
                  strokeDasharray="4 4" 
                  label={{ position: 'top', value: `Sector Avg: ${avgGrowth.toFixed(1)}%`, fill: '#10b981', fontSize: 10, fontWeight: 600 }} 
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

      {activeTab === "heatmap" && (
        <div className="space-y-4 overflow-x-auto pb-4">
          <div className="min-w-[600px]">
            <table className="w-full text-left border-collapse border-slate-200">
              <thead>
                <tr>
                  <th className="p-2 border-b border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50 sticky left-0 z-10 w-24">Ticker</th>
                  {months.slice(1).map((m, i) => (
                    <th key={i} className="p-2 border-b border-slate-200 text-[10px] font-semibold text-slate-500 bg-slate-50 text-center min-w-[60px] whitespace-nowrap">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((co) => (
                  <tr key={co.ticker}>
                    <td className="p-2 border-b border-slate-100 text-xs font-bold text-slate-700 bg-white sticky left-0 z-10 w-24 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      {co.ticker}
                    </td>
                    {co.historicalData.slice(1).map((dataPoint, idx) => {
                      const prevPrice = co.historicalData[idx].price;
                      const currentPrice = dataPoint.price;
                      const percentChange = ((currentPrice - prevPrice) / prevPrice) * 100;
                      
                      let bgColor = "bg-slate-100";
                      let textColor = "text-slate-600";
                      
                      if (percentChange > 2) {
                        bgColor = "bg-emerald-500";
                        textColor = "text-white";
                      } else if (percentChange > 0) {
                        bgColor = "bg-emerald-200";
                        textColor = "text-emerald-900";
                      } else if (percentChange < -2) {
                        bgColor = "bg-rose-500";
                        textColor = "text-white";
                      } else if (percentChange < 0) {
                        bgColor = "bg-rose-200";
                        textColor = "text-rose-900";
                      }

                      return (
                        <td key={idx} className="p-1 border-b border-slate-100 text-center">
                          <div className={`w-full h-8 flex items-center justify-center rounded-sm ${bgColor} ${textColor} text-[10px] font-medium transition-all hover:scale-105 cursor-default`} title={`${dataPoint.date}: ${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`}>
                            {percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> &lt; -2%</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-200 rounded-sm"></div> -2% to 0%</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-100 rounded-sm border border-slate-200"></div> 0%</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-200 rounded-sm"></div> 0% to +2%</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> &gt; +2%</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
