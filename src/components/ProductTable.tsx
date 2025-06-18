
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Filter, Download, Upload, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  sku: string;
  produto: string;
  estoque: number;
  custo: number;
  marca: string;
  precoMagalu: number;
  margemMagalu: number;
  precoMLClassico: number;
  margemMLClassico: number;
  precoMLPremium: number;
  margemMLPremium: number;
  ultimaAlteracao: string;
}

const sampleProducts: Product[] = [
  {
    sku: '57163',
    produto: 'Pneu 235/45R19 99W Sunset Ventura HP B1',
    estoque: 12,
    custo: 380.00,
    marca: 'B1',
    precoMagalu: 465.00,
    margemMagalu: 18.2,
    precoMLClassico: 450.00,
    margemMLClassico: 15.8,
    precoMLPremium: 480.00,
    margemMLPremium: 20.1,
    ultimaAlteracao: '2024-06-18',
  },
  {
    sku: '22263',
    produto: '255/35R20 PILOT SPORT 4S EXTRA LOAD 97Y MICHELIN',
    estoque: 7,
    custo: 1050.00,
    marca: 'MICHELIN',
    precoMagalu: 1280.00,
    margemMagalu: 18.0,
    precoMLClassico: 1250.00,
    margemMLClassico: 16.0,
    precoMLPremium: 1320.00,
    margemMLPremium: 20.5,
    ultimaAlteracao: '2024-06-18',
  },
];

export const ProductTable: React.FC = () => {
  const navigate = useNavigate();
  const [products] = useState<Product[]>(sampleProducts);
  const [filtroMarca, setFiltroMarca] = useState<string>('');
  const [filtroBusca, setFiltroBusca] = useState<string>('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getMargemColor = (margem: number) => {
    if (margem >= 20) return 'bg-emerald-100 text-emerald-800';
    if (margem >= 15) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const getEstoqueColor = (estoque: number) => {
    if (estoque === 0) return 'bg-red-100 text-red-800';
    if (estoque <= 5) return 'bg-amber-100 text-amber-800';
    return 'bg-emerald-100 text-emerald-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-900">Gestão de Pneus</h1>
          <p className="text-orange-700 mt-2">Controle de preços e margens por plataforma</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            onClick={() => navigate('/cadastrar')}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Pneu
          </Button>
        </div>
      </div>

      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-orange-800">Filtros</CardTitle>
            <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-orange-800">Buscar</label>
              <Input
                placeholder="SKU, produto..."
                value={filtroBusca}
                onChange={(e) => setFiltroBusca(e.target.value)}
                className="focus:ring-orange-500 focus:border-orange-500 border-orange-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-orange-800">Marca</label>
              <Select value={filtroMarca} onValueChange={setFiltroMarca}>
                <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500 border-orange-200">
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as marcas</SelectItem>
                  <SelectItem value="MICHELIN">MICHELIN</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-orange-800">Plataforma</label>
              <Select>
                <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500 border-orange-200">
                  <SelectValue placeholder="Todas as plataformas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as plataformas</SelectItem>
                  <SelectItem value="magalu">Magalu</SelectItem>
                  <SelectItem value="ml-classico">ML Clássico</SelectItem>
                  <SelectItem value="ml-premium">ML Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Pneus ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-orange-200">
                  <TableHead className="text-orange-800">SKU</TableHead>
                  <TableHead className="text-orange-800">Produto</TableHead>
                  <TableHead className="text-orange-800">Estoque</TableHead>
                  <TableHead className="text-orange-800">Custo</TableHead>
                  <TableHead className="text-orange-800">Marca</TableHead>
                  <TableHead className="text-orange-800">Magalu</TableHead>
                  <TableHead className="text-orange-800">ML Clássico</TableHead>
                  <TableHead className="text-orange-800">ML Premium</TableHead>
                  <TableHead className="text-orange-800">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.sku} className="border-orange-100 hover:bg-orange-50/30">
                    <TableCell className="font-medium text-orange-900">{product.sku}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={product.produto}>
                        {product.produto}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstoqueColor(product.estoque)}>
                        {product.estoque}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(product.custo)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-orange-200 text-orange-800">
                        {product.marca}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatCurrency(product.precoMagalu)}</div>
                        <Badge className={getMargemColor(product.margemMagalu)}>
                          {product.margemMagalu.toFixed(1)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatCurrency(product.precoMLClassico)}</div>
                        <Badge className={getMargemColor(product.margemMLClassico)}>
                          {product.margemMLClassico.toFixed(1)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatCurrency(product.precoMLPremium)}</div>
                        <Badge className={getMargemColor(product.margemMLPremium)}>
                          {product.margemMLPremium.toFixed(1)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-orange-100 text-orange-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
