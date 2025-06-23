
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Package, AlertCircle } from 'lucide-react';

const stats = [
  {
    title: 'Total de produtos',
    value: '2.847',
    change: '+12%',
    trend: 'up',
    icon: Package,
  },
  {
    title: 'Margem média Magalu',
    value: '18.5%',
    change: '+2.1%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Margem média ML Clássico',
    value: '15.2%',
    change: '-0.8%',
    trend: 'down',
    icon: TrendingDown,
  },
  {
    title: 'Produtos sem custo',
    value: '23',
    change: '-5',
    trend: 'up',
    icon: AlertCircle,
  },
];

const recentChanges = [
  {
    sku: '57163',
    produto: 'Pneu 235/45R19 99W Sunset Ventura HP B1',
    plataforma: 'Magalu',
    precoAntigo: 'R$ 450,00',
    precoNovo: 'R$ 465,00',
    margem: '+2.1%',
    usuario: 'João Silva',
    data: '2024-06-18 14:30',
  },
  {
    sku: '22263',
    produto: '255/35R20 PILOT SPORT 4S EXTRA LOAD 97Y MICHELIN',
    plataforma: 'ML Premium',
    precoAntigo: 'R$ 1.250,00',
    precoNovo: 'R$ 1.280,00',
    margem: '+1.8%',
    usuario: 'Maria Santos',
    data: '2024-06-18 13:45',
  },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema de precificação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-2">
                <Badge
                  variant={stat.trend === 'up' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alterações recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChanges.map((change, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{change.sku} - {change.produto.substring(0, 40)}...</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{change.plataforma}</Badge>
                        <span className="text-sm text-gray-500">
                          {change.precoAntigo} → {change.precoNovo}
                        </span>
                        <Badge variant="default">{change.margem}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {change.usuario} • {change.data}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas e notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">23 produtos sem custo</p>
                  <p className="text-xs text-gray-600">Revisar precificação</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium">5 produtos com estoque zerado</p>
                  <p className="text-xs text-gray-600">Atualizar disponibilidade</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Margens em alta</p>
                  <p className="text-xs text-gray-600">Oportunidade de revisão</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
