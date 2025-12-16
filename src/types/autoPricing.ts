// Tipos para o módulo de Precificação Inteligente

export type RuleStatus = 'active' | 'paused' | 'draft';
export type RuleType = 'competitor_based' | 'margin_based' | 'stock_based' | 'buybox_optimization' | 'composite';
export type Marketplace = 'mercadolivre_classico' | 'mercadolivre_premium' | 'magalu' | 'amazon' | 'shopee';
export type ScheduleFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly';

export interface SkuFilter {
  brands?: string[];
  categories?: string[];
  marketplaces?: Marketplace[];
  priceRange?: { min: number; max: number };
  marginRange?: { min: number; max: number };
  stockRange?: { min: number; max: number };
}

export interface SkuSelection {
  type: 'manual' | 'filter';
  manualSkus?: string[];
  filters?: SkuFilter;
}

// Parâmetros específicos por tipo de regra
export interface CompetitorBasedParams {
  strategy: 'match' | 'undercut' | 'premium';
  adjustmentType: 'percent' | 'fixed';
  adjustmentValue: number;
  minDifferenceToAct: number; // Só age se diferença > X%
  competitorSource: 'lowest' | 'average' | 'specific';
  specificCompetitor?: string;
}

export interface MarginBasedParams {
  targetMargin: number;
  tolerance: number;
  includeFreight: boolean;
  includeTaxes: boolean;
}

export interface StockBasedParams {
  highStockThreshold: number;
  highStockDiscountPercent: number;
  lowStockThreshold: number;
  lowStockPremiumPercent: number;
  usesDaysOfStock: boolean;
  averageDailySales?: number;
}

export interface BuyboxOptimizationParams {
  targetMarketplace: Marketplace;
  maxDiscountForBuybox: number;
  minMarginForBuybox: number;
}

export interface RuleParameters {
  competitorBased?: CompetitorBasedParams;
  marginBased?: MarginBasedParams;
  stockBased?: StockBasedParams;
  buyboxOptimization?: BuyboxOptimizationParams;
}

export interface Safeguards {
  minMargin: number;           // Margem mínima %
  maxDiscount: number;         // Desconto máximo %
  minPrice?: number;           // Preço mínimo absoluto
  maxPrice?: number;           // Preço máximo absoluto
  maxChangePercent: number;    // Variação máxima por execução
}

export interface Schedule {
  frequency: ScheduleFrequency;
  specificTime?: string;       // HH:mm para daily/weekly
  weekDays?: number[];         // 0-6 para weekly (0 = domingo)
}

export interface PricingRule {
  id: string;
  name: string;
  description: string;
  status: RuleStatus;
  priority: number;            // 1-100, maior = mais prioritário
  
  skuSelection: SkuSelection;
  ruleType: RuleType;
  ruleParameters: RuleParameters;
  safeguards: Safeguards;
  schedule: Schedule;
  
  // Metadados
  createdAt: string;
  updatedAt: string;
  lastExecutedAt?: string;
  createdBy: string;
}

// Dados de concorrentes importados
export interface CompetitorPrice {
  id: string;
  sku: string;
  competitorName: string;
  competitorPrice: number;
  marketplace: Marketplace;
  capturedAt: string;
}

// Resultado de simulação
export interface SimulationResult {
  sku: string;
  productName: string;
  marketplace: Marketplace;
  currentPrice: number;
  suggestedPrice: number;
  changePercent: number;
  reason: string;
  status: 'will_change' | 'no_change' | 'blocked';
  blockReason?: string;
}

export interface SimulationSummary {
  totalAnalyzed: number;
  willChange: number;
  noChange: number;
  blocked: number;
  results: SimulationResult[];
}

// Log de execução
export interface PriceChange {
  sku: string;
  productName: string;
  marketplace: Marketplace;
  previousPrice: number;
  newPrice: number;
  changePercent: number;
  reason: string;
  canRollback: boolean;
}

export interface ExecutionError {
  sku: string;
  error: string;
  timestamp: string;
}

export interface ExecutionLog {
  id: string;
  ruleId: string;
  ruleName: string;
  executedAt: string;
  status: 'success' | 'partial' | 'failed';
  
  summary: {
    totalSkusAnalyzed: number;
    pricesChanged: number;
    pricesUnchanged: number;
    errors: number;
  };
  
  changes: PriceChange[];
  errors?: ExecutionError[];
}

// Labels para exibição
export const RULE_TYPE_LABELS: Record<RuleType, string> = {
  competitor_based: 'Baseado em Concorrente',
  margin_based: 'Baseado em Margem',
  stock_based: 'Baseado em Estoque',
  buybox_optimization: 'Otimização Buy Box',
  composite: 'Regra Composta',
};

export const MARKETPLACE_LABELS: Record<Marketplace, string> = {
  mercadolivre_classico: 'Mercado Livre Clássico',
  mercadolivre_premium: 'Mercado Livre Premium',
  magalu: 'Magazine Luiza',
  amazon: 'Amazon',
  shopee: 'Shopee',
};

export const SCHEDULE_LABELS: Record<ScheduleFrequency, string> = {
  realtime: 'Tempo Real',
  hourly: 'A cada hora',
  daily: 'Diário',
  weekly: 'Semanal',
};

export const STATUS_LABELS: Record<RuleStatus, string> = {
  active: 'Ativa',
  paused: 'Pausada',
  draft: 'Rascunho',
};
