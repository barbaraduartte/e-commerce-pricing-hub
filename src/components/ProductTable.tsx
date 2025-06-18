
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
import { Edit, Filter, Download, Upload } from 'lucide-react';

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
    if (margem >= 20) return 'bg-green-100 text-green-800';
    if (margem >= 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getEstoqueColor = (estoque: number) => {
    if (estoque === 0) return 'bg-red-100 text-red-800';
    if (estoque <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Produtos</h1>
          <p className="text-gray-600 mt-2">Controle de preços e margens por plataforma</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Filtros</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <Input
                placeholder="SKU, produto..."
                value={filtroBusca}
                onChange={(e) => setFiltroBusca(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Marca</label>
              <Select value={filtroMarca} onValueChange={setFiltroMarca}>
                <SelectTrigger>
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
              <label className="text-sm font-medium mb-2 block">Plataforma</label>
              <Select>
                <SelectTrigger>
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

      <Card>
        <CardHeader>
          <CardTitle>Produtos ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Magalu</TableHead>
                  <TableHead>ML Clássico</TableHead>
                  <TableHead>ML Premium</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.sku}>
                    <TableCell className="font-medium">{product.sku}</TableCell>
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
                    <TableCell>{formatCurrency(product.custo)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.marca}</Badge>
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
                      <Button variant="ghost" size="sm">
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
