export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface CompanySelection {
  ticker: string;
  name: string;
  sector: string;
}

export interface CompanyAnalysis {
  ticker: string;
  name: string;
  sector: string;
  profile: string;
  earnings: string;
  peRatio: number;
  revenueGrowth: string;
  stockPerformance: string;
  competitivePositioning: string;
  potentialGrowth: string;
  historicalData: HistoricalDataPoint[];
}

export interface MarketOverview {
  economicContext: string;
  majorDrivers: string[];
  risks: string[];
}

export interface ConclusiveInsights {
  summary: string;
  recommendations: string[];
  investmentHypotheses: string[];
}

export interface Reference {
  source: string;
  url: string;
  description: string;
}

export interface ReportData {
  marketOverview: MarketOverview;
  companiesAnalysis: CompanyAnalysis[];
  conclusiveInsights: ConclusiveInsights;
  references: Reference[];
}

export interface SavedReport {
  id: string;
  title: string;
  createdAt: string;
  companies: CompanySelection[];
  data: ReportData;
}
