import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  PricingRule, 
  ExecutionLog, 
  CompetitorPrice, 
  SimulationSummary,
  RuleStatus 
} from '@/types/autoPricing';

interface AutoPricingContextType {
  // Regras
  rules: PricingRule[];
  addRule: (rule: PricingRule) => void;
  updateRule: (id: string, updates: Partial<PricingRule>) => void;
  deleteRule: (id: string) => void;
  toggleRuleStatus: (id: string, status: RuleStatus) => void;
  
  // Logs de execução
  executionLogs: ExecutionLog[];
  addExecutionLog: (log: ExecutionLog) => void;
  
  // Preços de concorrentes
  competitorPrices: CompetitorPrice[];
  importCompetitorPrices: (prices: CompetitorPrice[]) => void;
  clearCompetitorPrices: () => void;
  
  // Simulação
  currentSimulation: SimulationSummary | null;
  setCurrentSimulation: (simulation: SimulationSummary | null) => void;
  
  // UI State
  selectedRuleId: string | null;
  setSelectedRuleId: (id: string | null) => void;
}

const AutoPricingContext = createContext<AutoPricingContextType | undefined>(undefined);

// Dados de exemplo para demonstração
const sampleRules: PricingRule[] = [
  {
    id: '1',
    name: 'Competir com Menor Preço - Michelin',
    description: 'Ajusta preços para ficar 2% abaixo do menor concorrente para produtos Michelin',
    status: 'active',
    priority: 80,
    skuSelection: {
      type: 'filter',
      filters: {
        brands: ['MICHELIN'],
        marketplaces: ['mercadolivre_classico', 'mercadolivre_premium'],
      },
    },
    ruleType: 'competitor_based',
    ruleParameters: {
      competitorBased: {
        strategy: 'undercut',
        adjustmentType: 'percent',
        adjustmentValue: 2,
        minDifferenceToAct: 1,
        competitorSource: 'lowest',
      },
    },
    safeguards: {
      minMargin: 12,
      maxDiscount: 15,
      maxChangePercent: 5,
    },
    schedule: {
      frequency: 'hourly',
    },
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-18T14:30:00Z',
    lastExecutedAt: '2024-06-18T14:30:00Z',
    createdBy: 'admin',
  },
  {
    id: '2',
    name: 'Liquidação Estoque Alto',
    description: 'Reduz preço em 5% para produtos com mais de 50 unidades em estoque',
    status: 'paused',
    priority: 60,
    skuSelection: {
      type: 'filter',
      filters: {
        stockRange: { min: 50, max: 9999 },
      },
    },
    ruleType: 'stock_based',
    ruleParameters: {
      stockBased: {
        highStockThreshold: 50,
        highStockDiscountPercent: 5,
        lowStockThreshold: 5,
        lowStockPremiumPercent: 3,
        usesDaysOfStock: false,
      },
    },
    safeguards: {
      minMargin: 10,
      maxDiscount: 10,
      maxChangePercent: 5,
    },
    schedule: {
      frequency: 'daily',
      specificTime: '06:00',
    },
    createdAt: '2024-06-10T08:00:00Z',
    updatedAt: '2024-06-17T09:00:00Z',
    createdBy: 'admin',
  },
];

const sampleLogs: ExecutionLog[] = [
  {
    id: 'log1',
    ruleId: '1',
    ruleName: 'Competir com Menor Preço - Michelin',
    executedAt: '2024-06-18T14:30:00Z',
    status: 'success',
    summary: {
      totalSkusAnalyzed: 23,
      pricesChanged: 15,
      pricesUnchanged: 6,
      errors: 2,
    },
    changes: [
      {
        sku: '22263',
        productName: '255/35R20 PILOT SPORT 4S',
        marketplace: 'mercadolivre_classico',
        previousPrice: 1280,
        newPrice: 1265,
        changePercent: -1.17,
        reason: 'Ajuste para ficar 2% abaixo do concorrente (R$ 1.290,00)',
        canRollback: true,
      },
    ],
    errors: [
      {
        sku: '99999',
        error: 'SKU não encontrado no catálogo',
        timestamp: '2024-06-18T14:30:05Z',
      },
    ],
  },
];

export const AutoPricingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rules, setRules] = useState<PricingRule[]>(sampleRules);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>(sampleLogs);
  const [competitorPrices, setCompetitorPrices] = useState<CompetitorPrice[]>([]);
  const [currentSimulation, setCurrentSimulation] = useState<SimulationSummary | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const addRule = (rule: PricingRule) => {
    setRules(prev => [...prev, rule]);
  };

  const updateRule = (id: string, updates: Partial<PricingRule>) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === id
          ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
          : rule
      )
    );
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  };

  const toggleRuleStatus = (id: string, status: RuleStatus) => {
    updateRule(id, { status });
  };

  const addExecutionLog = (log: ExecutionLog) => {
    setExecutionLogs(prev => [log, ...prev]);
  };

  const importCompetitorPrices = (prices: CompetitorPrice[]) => {
    setCompetitorPrices(prev => [...prev, ...prices]);
  };

  const clearCompetitorPrices = () => {
    setCompetitorPrices([]);
  };

  return (
    <AutoPricingContext.Provider
      value={{
        rules,
        addRule,
        updateRule,
        deleteRule,
        toggleRuleStatus,
        executionLogs,
        addExecutionLog,
        competitorPrices,
        importCompetitorPrices,
        clearCompetitorPrices,
        currentSimulation,
        setCurrentSimulation,
        selectedRuleId,
        setSelectedRuleId,
      }}
    >
      {children}
    </AutoPricingContext.Provider>
  );
};

export const useAutoPricing = () => {
  const context = useContext(AutoPricingContext);
  if (context === undefined) {
    throw new Error('useAutoPricing must be used within an AutoPricingProvider');
  }
  return context;
};
