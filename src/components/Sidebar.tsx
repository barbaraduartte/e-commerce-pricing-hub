
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
  Settings,
  Plus
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Produtos', path: '/produtos' },
  { icon: Plus, label: 'Cadastrar Pneu', path: '/cadastrar' },
  { icon: DollarSign, label: 'Precificação', path: '/precificacao' },
  { icon: History, label: 'Histórico', path: '/historico' },
  { icon: Upload, label: 'Importar', path: '/importar' },
  { icon: Download, label: 'Relatórios', path: '/relatorios' },
  { icon: Users, label: 'Usuários', path: '/usuarios' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gradient-to-b from-orange-900 via-orange-800 to-orange-900 text-white shadow-2xl">
      <div className="p-6 border-b border-orange-700/50">
        <h1 className="text-xl font-bold text-orange-200">TirePricePro</h1>
        <p className="text-sm text-orange-300 mt-1">Sistema de Precificação de Pneus</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-orange-600 text-white border-r-4 border-orange-400 shadow-lg'
                  : 'text-orange-200 hover:bg-orange-800/50 hover:text-white hover:border-r-2 hover:border-orange-500'
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
