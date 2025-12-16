
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign,
  Zap,
  ChevronDown,
  ListChecks,
  History,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Produtos (?)', path: '/produtos' },
  { icon: DollarSign, label: 'Simulador', path: '/precificacao' },
];

const autoPricingItems = [
  { icon: ListChecks, label: 'Regras de Preço', path: '/precificacao-inteligente/regras' },
  { icon: History, label: 'Execuções', path: '/precificacao-inteligente/execucoes' },
  { icon: Upload, label: 'Importar Dados', path: '/precificacao-inteligente/importar' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [autoPricingOpen, setAutoPricingOpen] = useState(
    location.pathname.startsWith('/precificacao-inteligente')
  );

  const isAutoPricingActive = location.pathname.startsWith('/precificacao-inteligente');

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl">
      <div className="p-6 border-b border-blue-700/50">
        <h1 className="text-xl font-bold text-blue-200">Achei Pneus</h1>
        <p className="text-sm text-blue-300 mt-1">Sistema de precificação</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white border-r-4 border-blue-400 shadow-lg'
                  : 'text-blue-200 hover:bg-blue-800/50 hover:text-white hover:border-r-2 hover:border-blue-500'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}

        {/* Precificação Inteligente - Submenu */}
        <div>
          <button
            onClick={() => setAutoPricingOpen(!autoPricingOpen)}
            className={cn(
              'w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-all duration-200',
              isAutoPricingActive
                ? 'bg-blue-600 text-white border-r-4 border-blue-400 shadow-lg'
                : 'text-blue-200 hover:bg-blue-800/50 hover:text-white hover:border-r-2 hover:border-blue-500'
            )}
          >
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-3" />
              Prec. Inteligente
            </div>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                autoPricingOpen && 'rotate-180'
              )}
            />
          </button>
          
          {autoPricingOpen && (
            <div className="bg-blue-950/50">
              {autoPricingItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-6 pl-12 py-2.5 text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-700/50 text-white border-r-2 border-blue-400'
                        : 'text-blue-300 hover:bg-blue-800/30 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
