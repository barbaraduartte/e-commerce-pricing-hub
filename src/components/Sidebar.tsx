
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Produtos', path: '/produtos' },
  { icon: DollarSign, label: 'Precificação', path: '/precificacao' },
];

export const Sidebar: React.FC = () => {
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
      </nav>
    </div>
  );
};
