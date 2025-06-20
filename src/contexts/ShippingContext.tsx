
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface StateTax {
  state: string;
  stateName: string;
  taxPercentage: number; // Imposto único personalizado por estado
}

export interface TireConfig {
  width: number;     // largura (ex: 235)
  height: number;    // altura (ex: 50)
  diameter: number;  // aro (ex: 19)
  quantity: number;  // quantidade (1, 2 ou 4)
}

interface ShippingContextType {
  stateTaxes: StateTax[];
  selectedState: string;
  tireConfig: TireConfig;
  updateStateTax: (state: string, taxPercentage: number) => void;
  setSelectedState: (state: string) => void;
  updateTireConfig: (config: TireConfig) => void;
  getCurrentStateTaxes: () => StateTax | undefined;
  calculateFreight: () => number;
  calculateVolumetricWeight: () => number;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

const brazilianStates: StateTax[] = [
  { state: 'AC', stateName: 'Acre', taxPercentage: 26.25 },
  { state: 'AL', stateName: 'Alagoas', taxPercentage: 26.25 },
  { state: 'AP', stateName: 'Amapá', taxPercentage: 27.25 },
  { state: 'AM', stateName: 'Amazonas', taxPercentage: 27.25 },
  { state: 'BA', stateName: 'Bahia', taxPercentage: 27.25 },
  { state: 'CE', stateName: 'Ceará', taxPercentage: 27.25 },
  { state: 'DF', stateName: 'Distrito Federal', taxPercentage: 27.25 },
  { state: 'ES', stateName: 'Espírito Santo', taxPercentage: 26.25 },
  { state: 'GO', stateName: 'Goiás', taxPercentage: 26.25 },
  { state: 'MA', stateName: 'Maranhão', taxPercentage: 27.25 },
  { state: 'MT', stateName: 'Mato Grosso', taxPercentage: 26.25 },
  { state: 'MS', stateName: 'Mato Grosso do Sul', taxPercentage: 26.25 },
  { state: 'MG', stateName: 'Minas Gerais', taxPercentage: 27.25 },
  { state: 'PA', stateName: 'Pará', taxPercentage: 26.25 },
  { state: 'PB', stateName: 'Paraíba', taxPercentage: 27.25 },
  { state: 'PR', stateName: 'Paraná', taxPercentage: 27.25 },
  { state: 'PE', stateName: 'Pernambuco', taxPercentage: 27.25 },
  { state: 'PI', stateName: 'Piauí', taxPercentage: 27.25 },
  { state: 'RJ', stateName: 'Rio de Janeiro', taxPercentage: 27.25 },
  { state: 'RN', stateName: 'Rio Grande do Norte', taxPercentage: 27.25 },
  { state: 'RS', stateName: 'Rio Grande do Sul', taxPercentage: 27.25 },
  { state: 'RO', stateName: 'Rondônia', taxPercentage: 26.75 },
  { state: 'RR', stateName: 'Roraima', taxPercentage: 26.25 },
  { state: 'SC', stateName: 'Santa Catarina', taxPercentage: 26.25 },
  { state: 'SP', stateName: 'São Paulo', taxPercentage: 27.25 },
  { state: 'SE', stateName: 'Sergipe', taxPercentage: 27.25 },
  { state: 'TO', stateName: 'Tocantins', taxPercentage: 27.25 },
];

const defaultTireConfig: TireConfig = {
  width: 235,
  height: 50,
  diameter: 19,
  quantity: 1,
};

export const ShippingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stateTaxes, setStateTaxes] = useState<StateTax[]>(brazilianStates);
  const [selectedState, setSelectedState] = useState<string>('SP');
  const [tireConfig, setTireConfig] = useState<TireConfig>(defaultTireConfig);

  const updateStateTax = (state: string, taxPercentage: number) => {
    setStateTaxes(prev => 
      prev.map(stateTax => 
        stateTax.state === state 
          ? { ...stateTax, taxPercentage }
          : stateTax
      )
    );
  };

  const updateTireConfig = (config: TireConfig) => {
    setTireConfig(config);
  };

  const getCurrentStateTaxes = () => {
    return stateTaxes.find(tax => tax.state === selectedState);
  };

  const calculateVolumetricWeight = () => {
    // Baseado na sua planilha: Largura * Altura * Aro * Quantidade / 10000
    const { width, height, diameter, quantity } = tireConfig;
    return (width * height * diameter * quantity) / 10000;
  };

  const calculateFreight = () => {
    const W11 = calculateVolumetricWeight();
    
    // Implementação exata da sua fórmula Excel:
    // =SE(W11="";"";SE(E(W11>0;W11<=0,3);19,95; SE(E(W11>0,3;W11<=0,5);21,45; ...
    if (W11 === 0 || W11 === null || W11 === undefined) return 0;
    if (W11 > 0 && W11 <= 0.3) return 19.95;
    if (W11 > 0.3 && W11 <= 0.5) return 21.45;
    if (W11 > 0.5 && W11 <= 1) return 22.45;
    if (W11 > 1 && W11 <= 2) return 23.45;
    if (W11 > 2 && W11 <= 3) return 24.95;
    if (W11 > 3 && W11 <= 4) return 26.95;
    if (W11 > 4 && W11 <= 5) return 28.45;
    if (W11 > 5 && W11 <= 9) return 44.45;
    if (W11 > 9 && W11 <= 13) return 65.95;
    if (W11 > 13 && W11 <= 17) return 73.45;
    if (W11 > 17 && W11 <= 23) return 85.95;
    if (W11 > 23 && W11 <= 30) return 98.95;
    if (W11 > 30 && W11 <= 40) return 109.45;
    if (W11 > 40 && W11 <= 50) return 116.95;
    if (W11 > 50 && W11 <= 60) return 124.95;
    if (W11 > 60 && W11 <= 70) return 141.45;
    if (W11 > 70 && W11 <= 80) return 156.95;
    
    return 0; // Para valores fora da tabela ou inválidos
  };

  return (
    <ShippingContext.Provider value={{
      stateTaxes,
      selectedState,
      tireConfig,
      updateStateTax,
      setSelectedState,
      updateTireConfig,
      getCurrentStateTaxes,
      calculateFreight,
      calculateVolumetricWeight,
    }}>
      {children}
    </ShippingContext.Provider>
  );
};

export const useShipping = () => {
  const context = useContext(ShippingContext);
  if (context === undefined) {
    throw new Error('useShipping must be used within a ShippingProvider');
  }
  return context;
};
