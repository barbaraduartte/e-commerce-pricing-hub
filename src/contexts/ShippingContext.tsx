
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface StateTax {
  state: string;
  stateName: string;
  icms: number;
  ipi: number;
  pis: number;
  cofins: number;
}

export interface FreightConfig {
  length: number; // comprimento em cm
  width: number;  // largura em cm
  height: number; // altura em cm
  weight: number; // peso em kg
  pricePerKm: number; // preço por km
  baseCost: number; // custo base
}

interface ShippingContextType {
  stateTaxes: StateTax[];
  selectedState: string;
  freightConfig: FreightConfig;
  updateStateTax: (state: string, taxes: Omit<StateTax, 'state' | 'stateName'>) => void;
  setSelectedState: (state: string) => void;
  updateFreightConfig: (config: FreightConfig) => void;
  getCurrentStateTaxes: () => StateTax | undefined;
  calculateFreight: (distance: number) => number;
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

const defaultFreightConfig: FreightConfig = {
  length: 60,
  width: 20,
  height: 60,
  weight: 8,
  pricePerKm: 0.12,
  baseCost: 15.0,
};

export const ShippingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stateTaxes, setStateTaxes] = useState<StateTax[]>(brazilianStates);
  const [selectedState, setSelectedState] = useState<string>('SP');
  const [freightConfig, setFreightConfig] = useState<FreightConfig>(defaultFreightConfig);

  const updateStateTax = (state: string, taxes: Omit<StateTax, 'state' | 'stateName'>) => {
    setStateTaxes(prev => 
      prev.map(stateTax => 
        stateTax.state === state 
          ? { ...stateTax, ...taxes }
          : stateTax
      )
    );
  };

  const updateFreightConfig = (config: FreightConfig) => {
    setFreightConfig(config);
  };

  const getCurrentStateTaxes = () => {
    return stateTaxes.find(tax => tax.state === selectedState);
  };

  const calculateFreight = (distance: number) => {
    // Cálculo baseado em dimensões e peso do produto
    const volumetricWeight = (freightConfig.length * freightConfig.width * freightConfig.height) / 6000;
    const finalWeight = Math.max(freightConfig.weight, volumetricWeight);
    
    return freightConfig.baseCost + (distance * freightConfig.pricePerKm) + (finalWeight * 0.5);
  };

  return (
    <ShippingContext.Provider value={{
      stateTaxes,
      selectedState,
      freightConfig,
      updateStateTax,
      setSelectedState,
      updateFreightConfig,
      getCurrentStateTaxes,
      calculateFreight,
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
