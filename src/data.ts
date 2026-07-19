import { CompanySelection, ReportData } from "./types";

export const PRE_SEEDED_COMPANIES: CompanySelection[] = [
  // Technology
  { ticker: "MSFT", name: "Microsoft Corporation", sector: "Technology & Software" },
  { ticker: "NVDA", name: "NVIDIA Corporation", sector: "Technology & Semiconductors" },
  { ticker: "AAPL", name: "Apple Inc.", sector: "Technology & Consumer Devices" },
  
  // Healthcare
  { ticker: "LLY", name: "Eli Lilly and Company", sector: "Healthcare & Pharmaceuticals" },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare & Medical Devices" },
  { ticker: "UNH", name: "UnitedHealth Group", sector: "Healthcare & Insurance" },
  
  // Consumer Cyclical / Retail
  { ticker: "TSLA", name: "Tesla, Inc.", sector: "Consumer Cyclical & EV" },
  { ticker: "AMZN", name: "Amazon.com, Inc.", sector: "Consumer Cyclical & Cloud" },
  { ticker: "NKE", name: "Nike, Inc.", sector: "Consumer Cyclical & Apparel" },
  
  // Financial Services
  { ticker: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services & Banking" },
  { ticker: "V", name: "Visa Inc.", sector: "Financial Services & Payments" },
  { ticker: "BRK.B", name: "Berkshire Hathaway Inc.", sector: "Financial Services & Conglomerate" },
  
  // Energy & Industrials
  { ticker: "XOM", name: "Exxon Mobil Corporation", sector: "Energy & Oil" },
  { ticker: "CAT", name: "Caterpillar Inc.", sector: "Industrials & Machinery" }
];

export const SAMPLE_REPORT: ReportData = {
  marketOverview: {
    economicContext: "The mid-2026 economic environment is characterized by stable gross domestic product (GDP) growth, moderately cooling core inflation trending toward central bank targets of 2.1%, and a steady easing cycle by major central banks. Equity markets are demonstrating high-altitude consolidation as the risk-free rate of return (10-Year Treasury Yield) rests at 3.75%, encouraging a capital rotation from sovereign debt to risk-assets. High-growth sectors are highly sensitive to monetary policy, while value-oriented dividend producers continue to attract risk-averse asset managers looking for margin stability. Global supply chains have fully normalized, although persistent geopolitical realignments create regional input-cost premiums, particularly in semiconductors and advanced hardware manufacturing. Consumer confidence indices remain robust but elevated credit card delinquencies indicate potential friction in low-income brackets, highlighting a bifurcated spending dynamic.",
    majorDrivers: [
      "Monetary Easing Cycle: Easing central bank policy is lowering the weighted average cost of capital (WACC) across major industries, improving the net present value (NPV) of future growth projects.",
      "Enterprise Artificial Intelligence Monetization: Transitioning from theoretical capability to tangible balance-sheet contributions, driving premium pricing and operational margin efficiency across software, hardware, and service-based industries.",
      "Demographic Healthcare Shifts: Structural demand-shocks for GLP-1 receptor agonists and chronic care services driven by aging global populations and increased diagnostic access in developing economies."
    ],
    risks: [
      "Bifurcated Consumer Demand: Risk of aggregate spending decay if high interest-rate hangovers continue to impact highly leveraged consumer cohorts.",
      "Geopolitical and Regional Tariffs: Escalating trade realignments that could trigger secondary supply-chain friction, critical mineral restrictions, or regional assembly-cost premiums."
    ]
  },
  companiesAnalysis: [
    {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      sector: "Technology & Software",
      profile: "Microsoft Corporation is a preeminent global provider of enterprise software, cloud computing solutions (Azure), personal devices, and developer ecosystems. Its business model relies on highly sticky, recurring SaaS subscription models (Office 365, Copilot integrations) combined with consumption-based hybrid cloud storage. Microsoft is structurally positioned at the apex of the software industry due to its early and massive investment in generative AI infrastructure.",
      earnings: "In its most recent fiscal quarterly earnings, Microsoft reported consolidated revenue of $65.6B, representing a 16% YoY expansion. Diluted Earnings Per Share (EPS) came in at $3.30, exceeding Wall Street consensus by $0.22. Operating margins remained extraordinarily robust at 43%, supported by cost discipline and high-margin software renewals. Azure and other cloud services grew 33% YoY in constant currency, demonstrating resilient enterprise transition toward hybrid-cloud solutions.",
      peRatio: 34.8,
      revenueGrowth: "16.0% YoY",
      stockPerformance: "The stock is trading within a 52-week range of $385.00 to $452.00, close to its historical highs. Trading volume exhibits institutional support, with a steady beta of 1.15. The stock possesses a dividend yield of 0.72%, backed by a secure 24% payout ratio.",
      competitivePositioning: "Microsoft boasts a powerful multi-layered economic moat. Its Enterprise Agreement (EA) system locks in large corporate contracts for multi-year durations, creating high switching costs. Its commercial software packages represent industry standards with near-zero substitution rates. Additionally, its strategic relationship with OpenAI and early integration of AI Copilots across its entire suite creates a major technological head-start that competitors find difficult to erode.",
      potentialGrowth: "Key catalysts include the accelerated commercialization of Microsoft Copilot seats across Office 365 Enterprise, continuing capacity expansions in high-performance Azure data centers, and structural cost optimizations in software development via automated tooling.",
      historicalData: [
        { date: "Aug 2025", price: 395 },
        { date: "Sep 2025", price: 402 },
        { date: "Oct 2025", price: 410 },
        { date: "Nov 2025", price: 405 },
        { date: "Dec 2025", price: 420 },
        { date: "Jan 2026", price: 428 },
        { date: "Feb 2026", price: 432 },
        { date: "Mar 2026", price: 430 },
        { date: "Apr 2026", price: 438 },
        { date: "May 2026", price: 442 },
        { date: "Jun 2026", price: 448 },
        { date: "Jul 2026", price: 452 }
      ]
    },
    {
      ticker: "LLY",
      name: "Eli Lilly and Company",
      sector: "Healthcare & Pharmaceuticals",
      profile: "Eli Lilly and Company is a leading global biopharmaceutical innovator specializing in endocrine disorders, oncology, neuroscience, and immunology. Lilly operates a research-driven model, converting advanced biochemical discoveries into proprietary global therapeutics. The company's immediate valuation is strongly correlated with its massive lead in weight loss (obesity) and diabetes management drugs.",
      earnings: "Lilly reported recent quarterly revenues of $11.5B, showing an outstanding 36% YoY growth rate. Operating margins expanded to 31.5%, driven by the massive commercial scale of Mounjaro and Zepbound. Adjusted EPS grew 58% to $2.25. The company raised its full-year revenue outlook, backed by expanding production facility capacity across Indiana, North Carolina, and Germany.",
      peRatio: 68.2,
      revenueGrowth: "36.0% YoY",
      stockPerformance: "The stock is trading within a 52-week range of $680.00 to $910.00, reflecting extreme optimism regarding therapeutic adoption rates. Average daily trading volume has risen, reflecting strong capital inflows from growth managers. It exhibits a premium forward valuation due to unique product demand.",
      competitivePositioning: "Eli Lilly maintains an ironclad patent protection barrier around its key compounds (tirzepatide), preventing generic biosimilar intrusion. The massive capital required to clear FDA clinical trials creates high barriers to entry. Lilly's competitive advantage is augmented by its specialized manufacturing infrastructure for biologics and injection devices, which is highly capital-intensive and complex to duplicate.",
      potentialGrowth: "The primary growth driver is the continuing expansion of tirzepatide indications (Zepbound/Mounjaro) into sleep apnea, cardiovascular health, and NASH (liver disease). Additionally, its pipeline includes Alzheimer's therapeutic donanemab (Kisunla) which is poised for initial global commercial rollouts.",
      historicalData: [
        { date: "Aug 2025", price: 690 },
        { date: "Sep 2025", price: 710 },
        { date: "Oct 2025", price: 745 },
        { date: "Nov 2025", price: 730 },
        { date: "Dec 2025", price: 770 },
        { date: "Jan 2026", price: 810 },
        { date: "Feb 2026", price: 835 },
        { date: "Mar 2026", price: 850 },
        { date: "Apr 2026", price: 840 },
        { date: "May 2026", price: 875 },
        { date: "Jun 2026", price: 890 },
        { date: "Jul 2026", price: 910 }
      ]
    },
    {
      ticker: "TSLA",
      name: "Tesla, Inc.",
      sector: "Consumer Cyclical & EV",
      profile: "Tesla, Inc. is a vertically integrated electric vehicle manufacturer, clean energy storage provider, and robotics pioneer. Tesla utilizes direct-to-consumer sales, proprietary battery pack assemblies, and highly integrated gigafactories to capture manufacturing margins. It also holds a secondary software-like business model in its Full Self-Driving (FSD) subscription packages.",
      earnings: "Tesla reported revenue of $25.2B in its latest quarterly release, up 8% YoY. Operating margins landed at 10.8%, recovering from earlier price-cuts due to optimized battery component sourcing and increased regulatory credit sales ($620M). Diluted EPS came in at $0.72. Megapack energy storage deployments reached a record 9.4 GWh, presenting high-margin diversification.",
      peRatio: 52.4,
      revenueGrowth: "8.0% YoY",
      stockPerformance: "The stock is trading in a volatile 52-week band of $160.00 to $275.00, reflecting ongoing debate about vehicle margins versus autonomous driving potential. Beta remains elevated at 1.95, making it highly sensitive to macroeconomic sentiment and global manufacturing indices.",
      competitivePositioning: "Tesla's competitive moat is founded on manufacturing scale and charging infrastructure. The global Supercharger network acts as a powerful brand lock-in. Tesla's proprietary gigafactory architecture allows for lower structural overhead per vehicle compared to legacy automotive OEMs. Furthermore, Tesla's massive fleet of vehicles on the road provides a continuous data-gathering flywheel that trains its neural networks for autonomy, which competitors cannot match.",
      potentialGrowth: "Key growth drivers are the commercial launch of the affordable sub-$25K next-generation vehicle platform, massive scaling of the Megapack energy storage division to support utility-scale grid modernization, and regulatory approvals for unsupervised FSD robotaxis.",
      historicalData: [
        { date: "Aug 2025", price: 175 },
        { date: "Sep 2025", price: 188 },
        { date: "Oct 2025", price: 210 },
        { date: "Nov 2025", price: 195 },
        { date: "Dec 2025", price: 205 },
        { date: "Jan 2026", price: 220 },
        { date: "Feb 2026", price: 245 },
        { date: "Mar 2026", price: 235 },
        { date: "Apr 2026", price: 248 },
        { date: "May 2026", price: 255 },
        { date: "Jun 2026", price: 260 },
        { date: "Jul 2026", price: 275 }
      ]
    }
  ],
  conclusiveInsights: {
    summary: "This report synthesizes comprehensive research conducted on Microsoft (MSFT), Eli Lilly (LLY), and Tesla (TSLA) representing three primary sectors: Technology, Healthcare, and Consumer Cyclical. In a cooling inflation and stabilizing rate environment, Microsoft represents the core foundation of high-margin structural growth. Eli Lilly provides extraordinary secular demand insulated from macroeconomic cycles due to its breakthrough obesity drug pipeline, despite carrying a premium price. Tesla remains a high-volatility, high-potential asset where the energy storage division is starting to offset automotive cyclicality while the market waits for autonomous software catalysts.",
    aiInsightSummary: "Market dynamics show a clear shift towards AI-integrated enterprise software and high-margin healthcare therapeutics, while consumer cyclicals face macro headwinds.",
    recommendations: [
      "Microsoft (MSFT): Maintain as core long-term hold; track Azure cloud growth rates against hardware CAPEX expenditures to ensure healthy returns on investment.",
      "Eli Lilly (LLY): Track therapeutic supply chain expansion and international commercial rollouts; monitor competitive biosimilar pipelines that could disrupt Tirzepatide margins.",
      "Tesla (TSLA): Monitor gigafactory capacity utilization in China and Europe; track battery assembly cost declines and commercial Megapack order backlogs."
    ],
    investmentHypotheses: [
      "Hypothesis A: Microsoft's AI integrations (Copilot) will drive a 300 bps expansion in gross software margins by early 2027 as enterprise seat-license upgrades accelerate.",
      "Hypothesis B: Eli Lilly's tirzepatide scaling will sustain a 30%+ revenue compound annual growth rate (CAGR) for the next 3 years as global manufacturing capacity catches up with demand.",
      "Hypothesis C: Tesla's energy storage division will grow to represent over 25% of overall corporate gross profits by 2027, stabilizing earnings from cyclical automotive pricing pressure."
    ]
  },
  references: [
    {
      source: "U.S. Securities and Exchange Commission (SEC) EDGAR System",
      url: "https://www.sec.gov/edgar",
      description: "Retrieved primary financial documentation, Form 10-K and Form 10-Q filings for Microsoft, Eli Lilly, and Tesla, to compile accurate balance sheets, income statements, and segment revenue growth."
    },
    {
      source: "Federal Reserve Board Financial Stability Report",
      url: "https://www.federalreserve.gov",
      description: "Analyzed macroeconomic context, interest rate projections, and system-wide credit risks to draft the Market Overview."
    },
    {
      source: "Yahoo Finance Analyst Consensus & Company Valuation Metrics",
      url: "https://finance.yahoo.com",
      description: "Gathered historical trading prices, volume averages, beta ratings, P/E ratios, and institutional dividend coverage."
    }
  ],
  footerNotes: "Confidential and Proprietary. Not intended as direct financial advice."
};
