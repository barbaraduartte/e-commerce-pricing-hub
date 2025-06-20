import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface StateTax {
  state: string;
  stateName: string;
  icms: number;
  ipi: number;
  pis: number;
  cofins: number;
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
  updateStateTax: (state: string, taxes: Omit<StateTax, 'state' | 'stateName'>) => void;
  setSelectedState: (state: string) => void;
  updateTireConfig: (config: TireConfig) => void;
  getCurrentStateTaxes: () => StateTax | undefined;
  calculateFreight: () => number;
  calculateVolumetricWeight: () => number;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

const brazilianStates: StateTax[] = [
  { state: 'AC', stateName: 'Acre', icms: 17.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'AL', stateName: 'Alagoas', icms: 17.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'AP', stateName: 'Amapá', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'AM', stateName: 'Amazonas', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'BA', stateName: 'Bahia', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'CE', stateName: 'Ceará', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'DF', stateName: 'Distrito Federal', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'ES', stateName: 'Espírito Santo', icms: 17.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'GO', stateName: 'Goiás', icms: 17.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'MA', stateName: 'Maranhão', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'MT', stateName: 'Mato Grosso', icms: 17.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'MS', stateName: 'Mato Grosso do Sul', icms: 17.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'MG', stateName: 'Minas Gerais', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'PA', stateName: 'Pará', icms: 17.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'PB', stateName: 'Paraíba', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'PR', stateName: 'Paraná', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'PE', stateName: 'Pernambuco', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'PI', stateName: 'Piauí', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'RJ', stateName: 'Rio de Janeiro', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'RN', stateName: 'Rio Grande do Norte', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'RS', stateName: 'Rio Grande do Sul', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'RO', stateName: 'Rondônia', icms: 17.5, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'RR', stateName: 'Roraima', icms: 17.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'SC', stateName: 'Santa Catarina', icms: 17.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'SP', stateName: 'São Paulo', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'SE', stateName: 'Sergipe', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
  { state: 'TO', stateName: 'Tocantins', icms: 18.0, ipi: 0.0, pis: 1.65, cofins: 7.6 },
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

  const updateStateTax = (state: string, taxes: Omit<StateTax, 'state' | 'stateName'>) => {
    setStateTaxes(prev => 
      prev.map(stateTax => 
        stateTax.state === state 
          ? { ...stateTax, ...taxes }
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
    // Cálculo baseado na sua planilha: (largura * altura * aro * quantidade) / 10000
    const { width, height, diameter, quantity } = tireConfig;
    return (width * height * diameter * quantity) / 10000;
  };

  const calculateFreight = () => {
    const volumetricWeight = calculateVolumetricWeight();
    
    // Fórmula exata da sua planilha do Excel
    if (volumetricWeight === 0) return 0;
    if (volumetricWeight > 0 && volumetricWeight <= 0.3) return 19.95;
    if (volumetricWeight > 0.3 && volumetricWeight <= 0.5) return 21.45;
    if (volumetricWeight > 0.5 && volumetricWeight <= 1) return 22.45;
    if (volumetricWeight > 1 && volumetricWeight <= 2) return 23.45;
    if (volumetricWeight > 2 && volumetricWeight <= 3) return 24.95;
    if (volumetricWeight > 3 && volumetricWeight <= 4) return 26.95;
    if (volumetricWeight > 4 && volumetricWeight <= 5) return 28.45;
    if (volumetricWeight > 5 && volumetricWeight <= 9) return 44.45;
    if (volumetricWeight > 9 && volumetricWeight <= 13) return 65.95;
    if (volumetricWeight > 13 && volumetricWeight <= 17) return 73.45;
    if (volumetricWeight > 17 && volumetricWeight <= 23) return 85.95;
    if (volumetricWeight > 23 && volumetricWeight <= 30) return 98.95;
    if (volumetricWeight > 30 && volumetricWeight <= 40) return 109.45;
    if (volumetricWeight > 40 && volumetricWeight <= 50) return 116.95;
    if (volumetricWeight > 50 && volumetricWeight <= 60) return 124.95;
    if (volumetricWeight > 60 && volumetricWeight <= 70) return 141.45;
    if (volumetricWeight > 70 && volumetricWeight <= 80) return 156.95;
    
    return 0; // Para valores fora da tabela
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
