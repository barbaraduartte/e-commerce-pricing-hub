
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PlatformConfig {
  name: string;
  commission: number;
  color: string;
}

export interface TaxConfig {
  icms: number;
  ipi: number;
  pis: number;
  cofins: number;
}

interface PricingContextType {
  platforms: PlatformConfig[];
  taxes: TaxConfig;
  updatePlatformCommission: (platformName: string, commission: number) => void;
  updateTaxes: (taxes: TaxConfig) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

const defaultPlatforms: PlatformConfig[] = [
  { name: 'Magalu', commission: 12.5, color: 'bg-blue-100 text-blue-800' },
  { name: 'ML Clássico', commission: 15.0, color: 'bg-green-100 text-green-800' },
  { name: 'ML Premium', commission: 18.0, color: 'bg-purple-100 text-purple-800' },
];

const defaultTaxes: TaxConfig = {
  icms: 18.0,
  ipi: 0.0,
  pis: 1.65,
  cofins: 7.6,
};

export const PricingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [platforms, setPlatforms] = useState<PlatformConfig[]>(defaultPlatforms);
  const [taxes, setTaxes] = useState<TaxConfig>(defaultTaxes);

  const updatePlatformCommission = (platformName: string, commission: number) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.name === platformName 
          ? { ...platform, commission }
          : platform
      )
    );
  };

  const updateTaxes = (newTaxes: TaxConfig) => {
    setTaxes(newTaxes);
  };

  return (
    <PricingContext.Provider value={{ platforms, taxes, updatePlatformCommission, updateTaxes }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};
