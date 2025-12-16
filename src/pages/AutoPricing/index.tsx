import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RulesList } from './RulesList';
import { ExecutionHistory } from './ExecutionHistory';
import { CompetitorImport } from './CompetitorImport';

export const AutoPricingModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="regras" replace />} />
      <Route path="regras" element={<RulesList />} />
      <Route path="execucoes" element={<ExecutionHistory />} />
      <Route path="importar" element={<CompetitorImport />} />
    </Routes>
  );
};
