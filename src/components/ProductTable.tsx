
import React, { useState, useMemo } from 'react';
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
import { Filter, Download, Upload, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useToast } from '@/hooks/use-toast';
import { ProductEditModal } from './ProductEditModal';

export const ProductTable: React.FC = () => {
  const navigate = useNavigate();
  const { products, getAllBrands, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [filtroMarca, setFiltroMarca] = useState<string>('all');
  const [filtroBusca, setFiltroBusca] = useState<string>('');

  const brands = getAllBrands();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesBusca = product.sku.toLowerCase().includes(filtroBusca.toLowerCase()) ||
                          product.produto.toLowerCase().includes(filtroBusca.toLowerCase());
      const matchesMarca = filtroMarca === 'all' || product.marca === filtroMarca;
      return matchesBusca && matchesMarca;
    });
  }, [products, filtroBusca, filtroMarca]);

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

  const handleDeleteProduct = (sku: string, produto: string) => {
    if (confirm(`Tem certeza que deseja excluir o produto ${produto}?`)) {
      deleteProduct(sku);
      toast({
        title: "Produto excluído!",
        description: `O produto ${produto} foi removido com sucesso.`,
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Gestão de Pneus</h1>
          <p className="text-blue-700 mt-2">Controle de preços e margens por plataforma</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            onClick={() => navigate('/cadastrar')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Pneu
          </Button>
        </div>
      </div>

      
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-800">Filtros</CardTitle>
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-blue-800">Buscar</label>
              <Input
                placeholder="SKU, produto..."
                value={filtroBusca}
                onChange={(e) => setFiltroBusca(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 border-blue-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-blue-800">Marca</label>
              <Select value={filtroMarca} onValueChange={setFiltroMarca}>
                <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500 border-blue-200">
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {brands.map(marca => (
                    <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Pneus ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-200">
                  <TableHead className="text-blue-800">SKU</TableHead>
                  <TableHead className="text-blue-800">Produto</TableHead>
                  <TableHead className="text-blue-800">Estoque</TableHead>
                  <TableHead className="text-blue-800">Custo</TableHead>
                  <TableHead className="text-blue-800">Marca</TableHead>
                  <TableHead className="text-blue-800">Magalu</TableHead>
                  <TableHead className="text-blue-800">ML Clássico</TableHead>
                  <TableHead className="text-blue-800">ML Premium</TableHead>
                  <TableHead className="text-blue-800">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.sku} className="border-blue-100 hover:bg-blue-50/30">
                    <TableCell className="font-medium text-blue-900">{product.sku}</TableCell>
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
                      <Badge variant="outline" className="border-blue-200 text-blue-800">
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
                      <div className="flex space-x-1">
                        <ProductEditModal product={product} />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-red-100 text-red-600"
                          onClick={() => handleDeleteProduct(product.sku, product.produto)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
