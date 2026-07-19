import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Building2,
  Globe,
  Plus,
  Trash2,
  Sparkles,
  Info,
  Link2,
  FileText,
  Download,
  History,
  RotateCcw,
  FileCheck,
  Eye,
  Settings2,
  BookOpen,
  User,
  Cpu,
  Bookmark,
  CheckCircle2,
  Briefcase,
  Layers,
  AlertTriangle,
  HelpCircle,
  Clock
} from "lucide-react";
import { CompanySelection, ReportData, SavedReport } from "./types";
import { PRE_SEEDED_COMPANIES, SAMPLE_REPORT } from "./data";
import FinancialCharts from "./components/FinancialCharts";
import MarketOverviewComp from "./components/MarketOverviewComp";
import CompanyProfiles from "./components/CompanyProfiles";
import ConclusiveInsightsComp from "./components/ConclusiveInsightsComp";
import ReferencesComp from "./components/ReferencesComp";

export default function App() {
  // --- STATE DECLARATIONS ---
  const [availableCompanies, setAvailableCompanies] = useState<CompanySelection[]>(() => {
    const saved = localStorage.getItem("mr_available_companies");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return PRE_SEEDED_COMPANIES;
      }
    }
    return PRE_SEEDED_COMPANIES;
  });

  const [selectedTickers, setSelectedTickers] = useState<string[]>(["MSFT", "LLY", "TSLA"]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [reportData, setReportData] = useState<ReportData>(SAMPLE_REPORT);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [viewMode, setViewMode] = useState<"print" | "compact">("print");
  const [userName, setUserName] = useState("jenapratikkumar45@gmail.com");
  const [draftTitle, setDraftTitle] = useState("My Equity Research Report");
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    const saved = localStorage.getItem("mr_saved_reports");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Custom Company Adder Form State
  const [addTicker, setAddTicker] = useState("");
  const [addName, setAddName] = useState("");
  const [addSector, setAddSector] = useState("Technology & Semiconductors");
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Save available companies to local storage when changed
  useEffect(() => {
    localStorage.setItem("mr_available_companies", JSON.stringify(availableCompanies));
  }, [availableCompanies]);

  // Save drafted reports to local storage when changed
  useEffect(() => {
    localStorage.setItem("mr_saved_reports", JSON.stringify(savedReports));
  }, [savedReports]);

  // Loading Steps Cycling simulation
  useEffect(() => {
    if (!isLoading) return;
    const steps = [
      "Establishing connection to secure server...",
      "Initializing Gemini-3.5-flash AI Model...",
      "Querying SEC EDGAR filing structures for corporate metrics...",
      "Conducting historical price trajectory correlations...",
      "Calculating trailing Price-to-Earnings ratios...",
      "Analyzing quarterly earnings, EPS, and revenue trends...",
      "Formulating strategic barriers to entry and corporate moats...",
      "Drafting cohesive macro economic overview...",
      "Synthesizing actionable investment hypotheses...",
      "Assembling professional Word report formatting..."
    ];
    let idx = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      setLoadingStep(steps[idx]);
    }, 4500);
    return () => clearInterval(interval);
  }, [isLoading]);

  // --- ACTIONS ---

  // Handle custom stock addition
  const handleAddCustomCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTicker || !addName) {
      setErrorMsg("Ticker and Name are required.");
      return;
    }
    const tickerUpper = addTicker.trim().toUpperCase();
    if (availableCompanies.some(c => c.ticker === tickerUpper)) {
      setErrorMsg("This ticker is already registered.");
      return;
    }

    const newCo: CompanySelection = {
      ticker: tickerUpper,
      name: addName.trim(),
      sector: addSector
    };

    setAvailableCompanies([...availableCompanies, newCo]);
    setSelectedTickers([...selectedTickers, tickerUpper]);
    setAddTicker("");
    setAddName("");
    setShowAddCompanyForm(false);
    setErrorMsg("");
  };

  // Toggle company selection (Min 3, Max 5)
  const handleToggleTicker = (ticker: string) => {
    if (selectedTickers.includes(ticker)) {
      if (selectedTickers.length <= 3) {
        alert("You must select at least three companies to generate the report.");
        return;
      }
      setSelectedTickers(selectedTickers.filter(t => t !== ticker));
    } else {
      if (selectedTickers.length >= 5) {
        alert("You can select a maximum of five companies for a single report to maintain analysis depth.");
        return;
      }
      setSelectedTickers([...selectedTickers, ticker]);
    }
  };

  // Quick prompt suggestions
  const insertQuickPrompt = (text: string) => {
    setCustomPrompt(prev => prev ? `${prev}\n${text}` : text);
  };

  // Trigger server-side Gemini API analysis
  const handleRunAiResearch = async () => {
    if (selectedTickers.length < 3) {
      alert("Please select at least three companies to proceed.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const requestedCompanies = availableCompanies.filter(c => selectedTickers.includes(c.ticker));

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companies: requestedCompanies,
          customPrompt: customPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to execute server-side AI research.");
      }

      const generatedData: ReportData = await response.json();
      setReportData(generatedData);
      setDraftTitle(`Market Research Report (${requestedCompanies.map(c => c.ticker).join(", ")})`);
      alert("AI Deep Research Completed successfully! The interactive document workspace is updated.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during research generation.");
      alert(`Research Failed: ${err.message || "An unexpected error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to original preseeded sample report
  const handleResetToSample = () => {
    if (confirm("Are you sure you want to reset the report workspace? This will overwrite your current active draft.")) {
      setReportData(SAMPLE_REPORT);
      setSelectedTickers(["MSFT", "LLY", "TSLA"]);
      setDraftTitle("My Equity Research Report");
      setCustomPrompt("");
    }
  };

  // Local Storage draft saver
  const handleSaveDraft = () => {
    const activeCompaniesSelection = availableCompanies.filter(c => selectedTickers.includes(c.ticker));
    const newReport: SavedReport = {
      id: "report_" + Date.now(),
      title: draftTitle || "Untitled Equity Research Draft",
      createdAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      companies: activeCompaniesSelection,
      data: reportData
    };

    setSavedReports([newReport, ...savedReports]);
    alert(`Draft version "${newReport.title}" successfully committed to local storage archive.`);
  };

  const handleLoadSavedReport = (saved: SavedReport) => {
    if (confirm(`Do you want to load the saved draft version "${saved.title}"? Your current unsaved edits will be replaced.`)) {
      setReportData(saved.data);
      setDraftTitle(saved.title);
      setSelectedTickers(saved.companies.map(c => c.ticker));
    }
  };

  const handleDeleteSavedReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this draft version permanently from local archives?")) {
      setSavedReports(savedReports.filter(r => r.id !== id));
    }
  };

  // --- HTML WORD EXPORT ENGINE ---
  const generateDocHtml = (report: ReportData, email: string) => {
    const companyRows = report.companiesAnalysis.map(co => `
      <tr>
        <td style="font-weight: bold; color: #1e3a8a;">${co.ticker}</td>
        <td>${co.name}</td>
        <td>${co.sector}</td>
        <td style="text-align: right;">${co.peRatio}x</td>
        <td style="text-align: right; color: #0f766e; font-weight: bold;">${co.revenueGrowth}</td>
      </tr>
    `).join("");

    const companiesDetail = report.companiesAnalysis.map((co, idx) => `
      <div style="margin-top: 24pt; border-left: 4px solid #1e3a8a; padding-left: 12pt; margin-bottom: 12pt;">
        <h3 style="font-family: 'Arial', sans-serif; color: #1e3a8a; font-size: 14pt; margin: 0 0 4pt 0;">${idx + 1}. ${co.name} (${co.ticker})</h3>
        <p style="font-style: italic; color: #555555; font-size: 10pt; margin: 0;">Sector: ${co.sector} | Trailing P/E: ${co.peRatio}x | YoY Revenue Growth: ${co.revenueGrowth}</p>
      </div>
      
      <h4 style="font-size: 11pt; color: #374151; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt;">A. Corporate Profile & Business Model</h4>
      <p style="margin-bottom: 12pt; text-align: justify;">${co.profile}</p>

      <h4 style="font-size: 11pt; color: #374151; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt;">B. Recent Earnings & Financial Performance</h4>
      <p style="margin-bottom: 12pt; text-align: justify;">${co.earnings}</p>

      <h4 style="font-size: 11pt; color: #374151; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt;">C. Strategic Moats & Competitive Positioning</h4>
      <p style="margin-bottom: 12pt; text-align: justify;">${co.competitivePositioning}</p>

      <h4 style="font-size: 11pt; color: #374151; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt;">D. Future Catalysts & Potential Growth</h4>
      <p style="margin-bottom: 12pt; text-align: justify;">${co.potentialGrowth}</p>

      <h4 style="font-size: 11pt; color: #374151; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt;">E. Stock Price & Trailing Trends</h4>
      <p style="margin-bottom: 12pt; text-align: justify;">${co.stockPerformance}</p>
    `).join("");

    const driversList = report.marketOverview.majorDrivers.map(d => `<li style="margin-bottom: 6pt;">${d}</li>`).join("");
    const risksList = report.marketOverview.risks.map(r => `<li style="margin-bottom: 6pt; color: #b91c1c;">${r}</li>`).join("");
    const recsList = report.conclusiveInsights.recommendations.map(r => `<li style="margin-bottom: 6pt;">${r}</li>`).join("");
    const hypothesesList = report.conclusiveInsights.investmentHypotheses.map(h => `
      <li style="margin-bottom: 8pt; background-color: #fcfaff; padding: 6px; border-left: 2px solid #7c3aed;">
        ${h}
      </li>
    `).join("");

    const referencesList = report.references.map(ref => `
      <div style="margin-bottom: 12pt; padding-bottom: 8pt; border-bottom: 1px dashed #e5e7eb;">
        <p style="font-weight: bold; font-size: 10.5pt; margin-bottom: 2pt;">${ref.source}</p>
        ${ref.url && ref.url !== "#" ? `<p style="font-size: 9pt; color: #1e3a8a; font-family: monospace; margin: 0 0 2pt 0;">URL: ${ref.url}</p>` : ""}
        <p style="font-size: 9.5pt; color: #4b5563; margin: 0;">${ref.description}</p>
      </div>
    `).join("");

    return `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Market Research and Stock Analysis Report</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
  body {
    font-family: 'Calibri', 'Arial', sans-serif;
    line-height: 1.6;
    color: #333333;
    margin: 1in;
  }
  .title-page {
    text-align: center;
    padding-top: 100pt;
    height: 100%;
    page-break-after: always;
  }
  .report-title {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 28pt;
    font-weight: bold;
    color: #1e3a8a;
    line-height: 1.2;
    margin-bottom: 12pt;
  }
  .report-subtitle {
    font-family: 'Arial', sans-serif;
    font-size: 14pt;
    color: #4b5563;
    margin-bottom: 48pt;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .metadata-box {
    margin-top: 150pt;
    border-top: 2px solid #e5e7eb;
    padding-top: 12pt;
    font-size: 10.5pt;
    color: #555555;
    text-align: left;
    width: 300pt;
    margin-left: auto;
    margin-right: auto;
  }
  h1 {
    font-family: 'Georgia', serif;
    color: #1e3a8a;
    font-size: 20pt;
    border-bottom: 2px solid #1e3a8a;
    padding-bottom: 6px;
    margin-top: 36pt;
    margin-bottom: 12pt;
    page-break-before: always;
  }
  h2 {
    font-family: 'Georgia', serif;
    color: #0f766e;
    font-size: 15pt;
    margin-top: 20pt;
    margin-bottom: 8pt;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 4px;
  }
  p {
    font-size: 11pt;
    margin-top: 0;
    margin-bottom: 10pt;
    text-align: justify;
  }
  ul, ol {
    margin-top: 0;
    margin-bottom: 12pt;
    padding-left: 24pt;
  }
  li {
    font-size: 11pt;
    margin-bottom: 6pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16pt;
    margin-bottom: 16pt;
  }
  th {
    background-color: #f3f4f6;
    color: #1e3a8a;
    font-weight: bold;
    border: 1px solid #cbd5e1;
    padding: 10px;
    text-align: left;
    font-size: 10.5pt;
  }
  td {
    border: 1px solid #e2e8f0;
    padding: 10px;
    font-size: 10pt;
    color: #334155;
  }
  .header-tag {
    font-size: 9pt;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 24pt;
  }
  .footer {
    font-size: 8.5pt;
    color: #94a3b8;
    text-align: center;
    margin-top: 48pt;
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
  }
</style>
</head>
<body>

  <!-- Title Page -->
  <div class="title-page">
    <div class="header-tag">FORMAL EQUITY RESEARCH DRAFT</div>
    <div class="report-title">MARKET RESEARCH &<br>STOCK ANALYSIS REPORT</div>
    <div class="report-subtitle">Sector Outlooks, Earnings Audits, and Growth Trajectories</div>
    
    <div class="metadata-box">
      <strong>Prepared By:</strong> ${email || "jenapratikkumar45@gmail.com"}<br>
      <strong>Research Scope:</strong> Multi-Sector Asset Analysis<br>
      <strong>Target Companies:</strong> ${report.companiesAnalysis.map(co => `${co.ticker}`).join(", ")}<br>
      <strong>Date Generated:</strong> July 18, 2026<br>
      <strong>Methodology:</strong> Primary SEC Filings Audit & Macro AI Synthesis
    </div>
  </div>

  <!-- Table of Contents Placeholder -->
  <h1>Table of Contents</h1>
  <p style="margin-bottom: 6pt;"><strong>1. Executive Market Overview & Macroeconomic Context</strong> <span style="float: right;">Page 2</span></p>
  <p style="margin-bottom: 6pt;"><strong>2. Selected Companies Comparative Metrics</strong> <span style="float: right;">Page 3</span></p>
  <p style="margin-bottom: 6pt;"><strong>3. Individual Equity Profiling & Audit Notes</strong> <span style="float: right;">Page 4</span></p>
  <p style="margin-bottom: 6pt;"><strong>4. Conclusive Insights & Actionable Recommendations</strong> <span style="float: right;">Page 6</span></p>
  <p style="margin-bottom: 6pt;"><strong>5. Source Literature & Academic References</strong> <span style="float: right;">Page 7</span></p>

  <!-- Section 1 -->
  <h1>1. Executive Market Overview & Macroeconomic Context</h1>
  <p>${report.marketOverview.economicContext}</p>
  
  <h2>Primary Sector Growth Drivers</h2>
  <ul>
    ${driversList}
  </ul>

  <h2>Identified Systemic Market Risks</h2>
  <ul>
    ${risksList}
  </ul>

  <!-- Section 2 -->
  <h1>2. Selected Companies Comparative Metrics</h1>
  <p>To analyze relative equity valuations and financial trajectories, the following index displays key ratios of the chosen sector representatives:</p>
  
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Company Name</th>
        <th>Sector Classification</th>
        <th style="text-align: right;">Trailing P/E Ratio</th>
        <th style="text-align: right;">YoY Revenue Growth</th>
      </tr>
    </thead>
    <tbody>
      ${companyRows}
    </tbody>
  </table>
  <p style="font-size: 9pt; color: #64748b; font-style: italic; text-align: center;">Figure 1.1: Relative valuations and revenue growths, compiled for fiscal Q2 2026 reporting cycles.</p>

  <!-- Section 3 -->
  <h1>3. Individual Equity Profiling & Audit Notes</h1>
  <p>This section compiles individual investment profiles, recent quarterly earnings results, and strategic entry assessments for each selected corporation:</p>
  ${companiesDetail}

  <!-- Section 4 -->
  <h1>4. Conclusive Insights & Actionable Recommendations</h1>
  <h2>Synthesis of Findings</h2>
  <p>${report.conclusiveInsights.summary}</p>

  <h2>Actionable Tracking Guidelines & Watchlists</h2>
  <ul>
    ${recsList}
  </ul>

  <h2>Investment Hypotheses Formulation</h2>
  <ol>
    ${hypothesesList}
  </ol>

  <!-- Section 5 -->
  <h1>5. Source Literature & Academic References</h1>
  <p>The following public portals, regulatory databases, and financial literature channels were audited during the compilation of this research report:</p>
  ${referencesList}

  <div class="footer">
    End of Equity Research Report – Confidential and Proprietary Document
  </div>

</body>
</html>
`;
  };

  const downloadDocFile = () => {
    const htmlContent = generateDocHtml(reportData, userName);
    // Convert html to document blob using UTF-8 BOM to ensure seamless word rendering
    const blob = new Blob(["\ufeff" + htmlContent], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const cleanTitle = (draftTitle || "Market_Research_Stock_Analysis_Report").replace(/[^a-zA-Z0-9_-]/g, "_");
    a.download = `${cleanTitle}_July2026.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadHtmlFile = () => {
    const htmlContent = generateDocHtml(reportData, userName);
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const cleanTitle = (draftTitle || "Market_Research_Stock_Analysis_Report").replace(/[^a-zA-Z0-9_-]/g, "_");
    a.download = `${cleanTitle}_July2026.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900" id="app-root">
      {/* HEADER BAR */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shrink-0 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-inner flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans text-base font-bold tracking-tight">Market Research & Stock Analysis Report Builder</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Week 1 Portfolio
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Formal Financial Audit and DOC Export Platform</p>
            </div>
          </div>
          
          {/* Metadata Indicator */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md border border-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-300 font-mono text-[11px]">{userName}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-mono">July 18, 2026</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Fullstack Mode Active
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* LEFT COLUMN: Setup & Research Controls */}
        <aside className="w-full lg:w-[410px] shrink-0 flex flex-col gap-5 overflow-y-auto pr-0 lg:pr-1" id="control-panel">
          
          {/* SECTION 1: SELECTED COMPANIES */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Step 1: Select Target Companies
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Select 3 to 5 sector leaders to compare and generate analysis reports for</p>
            </div>

            {/* List of companies */}
            <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
              {availableCompanies.map((co) => {
                const isSelected = selectedTickers.includes(co.ticker);
                return (
                  <button
                    key={co.ticker}
                    onClick={() => handleToggleTicker(co.ticker)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "bg-indigo-50/50 border-indigo-200 hover:bg-indigo-50"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800">{co.ticker}</span>
                        <span className="text-slate-400 mx-1.5">|</span>
                        <span className="text-[11px] text-slate-600 font-medium">{co.name}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-sm max-w-[110px] truncate">
                      {co.sector}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selection feedback */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Selected:</span>
              <span className={`font-bold ${selectedTickers.length >= 3 && selectedTickers.length <= 5 ? "text-indigo-600" : "text-amber-600"}`}>
                {selectedTickers.length} / 5 companies (min 3)
              </span>
            </div>

            {/* Custom stock injector */}
            <div className="border-t border-slate-100 pt-3">
              {!showAddCompanyForm ? (
                <button
                  onClick={() => setShowAddCompanyForm(true)}
                  className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                  Inject Custom Stock Ticker
                </button>
              ) : (
                <form onSubmit={handleAddCustomCompany} className="bg-slate-50 p-3.5 border border-slate-200 rounded-lg space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Register Custom Asset</h4>
                    <button
                      type="button"
                      onClick={() => setShowAddCompanyForm(false)}
                      className="text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Ticker *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AAPL"
                        value={addTicker}
                        onChange={(e) => setAddTicker(e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-sm focus:border-indigo-500 outline-hidden uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apple Inc."
                        value={addName}
                        onChange={(e) => setAddName(e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-sm focus:border-indigo-500 outline-hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Sector *</label>
                    <select
                      value={addSector}
                      onChange={(e) => setAddSector(e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-sm focus:border-indigo-500 outline-hidden"
                    >
                      <option>Technology & Software</option>
                      <option>Technology & Semiconductors</option>
                      <option>Healthcare & Pharmaceuticals</option>
                      <option>Consumer Cyclical & Retail</option>
                      <option>Financial Services & Banking</option>
                      <option>Energy & Oil</option>
                      <option>Industrials & Machinery</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded shadow-xs"
                  >
                    Confirm Register Asset
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* SECTION 2: AI FOCUS & CONTROL */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Step 2: AI Analyst Custom Guidelines
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Provide direct instructions to the Gemini model to guide analysis</p>
            </div>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
              placeholder="e.g. Focus on interest rate impacts, SWOT tables, bearish risk factors, and 2026 forward valuations..."
              className="w-full px-3 py-2 text-xs text-slate-700 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-hidden resize-none transition-all"
            />

            {/* Quick chips helper */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Insert Quick Directives:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => insertQuickPrompt("Analyze interest rate cuts effect on sector cost of capital.")}
                  className="px-2 py-0.5 text-[9px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded border border-slate-200/60 transition-all"
                >
                  Rate Cut Easing
                </button>
                <button
                  onClick={() => insertQuickPrompt("Compare enterprise margin stability and cost management strategies.")}
                  className="px-2 py-0.5 text-[9px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded border border-slate-200/60 transition-all"
                >
                  Margin Pressures
                </button>
                <button
                  onClick={() => insertQuickPrompt("Formulate bearish systematic risks and supply chain single-point failure risks.")}
                  className="px-2 py-0.5 text-[9px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded border border-slate-200/60 transition-all"
                >
                  Bearish Vectors
                </button>
                <button
                  onClick={() => insertQuickPrompt("Detail proprietary moats, global distribution leverage, and technical patents.")}
                  className="px-2 py-0.5 text-[9px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded border border-slate-200/60 transition-all"
                >
                  Economic Moats
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleRunAiResearch}
              disabled={isLoading || selectedTickers.length < 3}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all ${
                isLoading || selectedTickers.length < 3
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-100 animate-pulse hover:animate-none"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Generate Deep-Research Report
            </button>
          </section>

          {/* SECTION 3: SAVED ARCHIVES */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-indigo-600" />
                  Saved Report Archives
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Access previously committed document drafts</p>
              </div>
              <span className="bg-slate-100 text-slate-600 font-mono text-[10px] px-2 py-0.5 rounded-full font-semibold">
                {savedReports.length} Drafts
              </span>
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {savedReports.map((saved) => (
                <div
                  key={saved.id}
                  onClick={() => handleLoadSavedReport(saved)}
                  className="p-2.5 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-100 rounded-lg text-left cursor-pointer transition-all flex justify-between items-center group"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{saved.title}</h4>
                    <p className="text-[9px] text-slate-400 flex items-center gap-1">
                      <span>{saved.createdAt}</span>
                      <span>•</span>
                      <span className="font-mono text-indigo-600 font-semibold">
                        {saved.companies.map(c => c.ticker).join(", ")}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSavedReport(saved.id, e)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {savedReports.length === 0 && (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg">
                  <p className="text-[10px] text-slate-400 italic">No archived drafts found in this browser container.</p>
                </div>
              )}
            </div>
          </section>
        </aside>

        {/* RIGHT COLUMN: Interactive Document Editor & Canvas */}
        <main className="flex-1 flex flex-col min-w-0 gap-4" id="document-workspace">
          
          {/* Action Ribbon */}
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="text-sm font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 px-1 py-0.5 rounded outline-hidden w-64"
                title="Edit Draft Title"
                placeholder="Name your report..."
              />
            </div>

            {/* Document Export Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
                title="Commit active report to Local Storage draft history"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                Commit Draft
              </button>
              
              <button
                onClick={handleResetToSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
                title="Reset workspace to default"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                Reset Workspace
              </button>

              <button
                onClick={downloadHtmlFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                title="Download HTML draft"
              >
                <Globe className="w-3.5 h-3.5" />
                Export HTML
              </button>

              <button
                onClick={downloadDocFile}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow-md transition-all border border-indigo-700"
                title="Export complete draft as formal Microsoft Word .DOC"
              >
                <Download className="w-3.5 h-3.5" />
                Download Report (.DOC)
              </button>
            </div>
          </div>

          {/* LOADING COVER SHEET */}
          {isLoading ? (
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center space-y-6 shadow-sm min-h-[400px]">
              <div className="relative flex items-center justify-center">
                {/* Spinning gear animations */}
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <Cpu className="absolute w-6 h-6 text-indigo-600 animate-pulse" />
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Conducting Equity Market Audits...</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-mono bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100">
                  {loadingStep}
                </p>
                <div className="w-64 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden mt-3">
                  <div className="h-full bg-indigo-600 rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: "80%" }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-slate-100 border border-slate-200 p-4 sm:p-6 overflow-y-auto max-h-[80vh] rounded-xl shadow-inner relative flex flex-col gap-6">
              
              {/* PRINT PREVIEW PAPER CONTAINER */}
              <div className="max-w-4xl w-full mx-auto bg-white shadow-lg border border-slate-200 p-6 sm:p-10 min-h-[11in] rounded-sm relative text-slate-800 leading-relaxed font-sans space-y-8 flex-1">
                
                {/* FORMAL COVER PAGE COMPONENT */}
                <div className="border-b border-slate-100 pb-8 text-center sm:text-left">
                  <div className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                    FORMAL EQUITY RESEARCH DRAFT // portfolio-series
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                    MARKET RESEARCH & STOCK ANALYSIS REPORT
                  </h1>
                  <p className="font-sans text-sm text-slate-500 mt-2 uppercase tracking-wider font-semibold">
                    Sector Growth, Earnings Audits, and Long-Term Value Trajectories
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
                    <div>
                      <span className="font-bold text-slate-400 block uppercase text-[10px]">Lead Analyst</span>
                      <span className="font-semibold text-slate-700">{userName}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 block uppercase text-[10px]">Methodology</span>
                      <span className="font-semibold text-slate-700">SEC Audits & AI Synthesis</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 block uppercase text-[10px]">Document Status</span>
                      <span className="font-semibold text-indigo-600">Editable Workspace</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 block uppercase text-[10px]">Compilation Cycle</span>
                      <span className="font-semibold text-slate-700">July 18, 2026</span>
                    </div>
                  </div>
                </div>

                {/* TABLE OF CONTENTS */}
                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-lg text-xs space-y-2">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">
                    Table of Contents (Word Document Index)
                  </h4>
                  <div className="space-y-1 text-slate-600 font-medium">
                    <div className="flex justify-between">
                      <span>1. Executive Market Overview & Macroeconomic Context</span>
                      <span className="font-mono text-slate-400">Page 2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2. Selected Companies Comparative Metrics</span>
                      <span className="font-mono text-slate-400">Page 3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3. Individual Equity Profiling & Audit Notes</span>
                      <span className="font-mono text-slate-400">Page 4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>4. Conclusive Insights & Actionable Recommendations</span>
                      <span className="font-mono text-slate-400">Page 6</span>
                    </div>
                    <div className="flex justify-between">
                      <span>5. Source Literature & Academic References</span>
                      <span className="font-mono text-slate-400">Page 7</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 1: MARKET OVERVIEW */}
                <MarketOverviewComp
                  data={reportData.marketOverview}
                  onChange={(updated) => setReportData({ ...reportData, marketOverview: updated })}
                />

                {/* DYNAMIC VALUATION VISUALIZATION GRAPH */}
                <FinancialCharts companies={reportData.companiesAnalysis} />

                {/* SECTION 2: INDIVIDUAL COMPANY ANALYSIS */}
                <CompanyProfiles
                  companies={reportData.companiesAnalysis}
                  onChange={(updated) => setReportData({ ...reportData, companiesAnalysis: updated })}
                />

                {/* SECTION 3: CONCLUSIVE INSIGHTS */}
                <ConclusiveInsightsComp
                  data={reportData.conclusiveInsights}
                  onChange={(updated) => setReportData({ ...reportData, conclusiveInsights: updated })}
                />

                {/* SECTION 4: REFERENCES MANAGER */}
                <ReferencesComp
                  references={reportData.references}
                  onChange={(updated) => setReportData({ ...reportData, references: updated })}
                />

                {/* PAPER FOOTER */}
                <div className="border-t border-slate-100 pt-6 text-center text-[10px] text-slate-400">
                  End of Draft Report – Week 1 Financial Portfolio Series. Generated using Gemini Deep Analysis.
                </div>

              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

