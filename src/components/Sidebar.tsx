
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  History, 
  Upload, 
  Download,
  Users,
  Settings
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Produtos', path: '/produtos' },
  { icon: DollarSign, label: 'Precificação', path: '/precificacao' },
  { icon: History, label: 'Histórico', path: '/historico' },
  { icon: Upload, label: 'Importar', path: '/importar' },
  { icon: Download, label: 'Relatórios', path: '/relatorios' },
  { icon: Users, label: 'Usuários', path: '/usuarios' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-slate-900 text-white">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-400">PricingPro</h1>
        <p className="text-sm text-gray-400 mt-1">Sistema de Precificação</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
