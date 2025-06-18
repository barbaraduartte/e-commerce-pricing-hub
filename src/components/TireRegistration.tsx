
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, RotateCcw, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TireData {
  sku: string;
  produto: string;
  marca: string;
  aro: string;
  largura: string;
  perfil: string;
  indiceVelocidade: string;
  indiceCarga: string;
  estoque: number;
  custo: number;
  categoria: string;
  observacoes: string;
}

const marcasPneus = [
  'MICHELIN', 'BRIDGESTONE', 'GOODYEAR', 'PIRELLI', 'CONTINENTAL',
  'DUNLOP', 'YOKOHAMA', 'TOYO', 'KUMHO', 'HANKOOK', 'NEXEN',
  'MAXXIS', 'FALKEN', 'NITTO', 'BF GOODRICH', 'GENERAL',
  'COOPER', 'UNIROYAL', 'FIRESTONE', 'OUTROS'
];

const categoriasPneus = [
  'PASSEIO', 'SUV/4X4', 'PICKUP', 'COMERCIAL LEVE', 'CAMINHÃO',
  'MOTO', 'AGRICULTURAL', 'INDUSTRIAL', 'RACING'
];

export const TireRegistration: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TireData>({
    sku: '',
    produto: '',
    marca: '',
    aro: '',
    largura: '',
    perfil: '',
    indiceVelocidade: '',
    indiceCarga: '',
    estoque: 0,
    custo: 0,
    categoria: '',
    observacoes: ''
  });

  const handleInputChange = (field: keyof TireData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-5);
    const newSKU = `PN${timestamp}`;
    handleInputChange('sku', newSKU);
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      produto: '',
      marca: '',
      aro: '',
      largura: '',
      perfil: '',
      indiceVelocidade: '',
      indiceCarga: '',
      estoque: 0,
      custo: 0,
      categoria: '',
      observacoes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.sku || !formData.produto || !formData.marca) {
      toast({
        title: "Erro de validação",
        description: "SKU, Produto e Marca são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Simular salvamento
    console.log('Dados do pneu cadastrado:', formData);
    
    toast({
      title: "Pneu cadastrado com sucesso!",
      description: `SKU ${formData.sku} foi adicionado ao sistema.`,
      className: "bg-orange-50 border-orange-200 text-orange-800",
    });

    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastro de Pneus</h1>
          <p className="text-gray-600 mt-2">Adicione novos pneus ao sistema de precificação</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetForm}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar
          </Button>
          <Button onClick={generateSKU} className="bg-orange-600 hover:bg-orange-700">
            <Package className="w-4 h-4 mr-2" />
            Gerar SKU
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-800">Informações do Pneu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primeira linha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="ex: 57163"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="marca">Marca *</Label>
                <Select value={formData.marca} onValueChange={(value) => handleInputChange('marca', value)}>
                  <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcasPneus.map(marca => (
                      <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                  <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasPneus.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Segunda linha - Especificações técnicas */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="largura">Largura</Label>
                <Input
                  id="largura"
                  value={formData.largura}
                  onChange={(e) => handleInputChange('largura', e.target.value)}
                  placeholder="ex: 235"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="perfil">Perfil</Label>
                <Input
                  id="perfil"
                  value={formData.perfil}
                  onChange={(e) => handleInputChange('perfil', e.target.value)}
                  placeholder="ex: 45"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="aro">Aro</Label>
                <Input
                  id="aro"
                  value={formData.aro}
                  onChange={(e) => handleInputChange('aro', e.target.value)}
                  placeholder="ex: R19"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="indiceCarga">Índice Carga</Label>
                <Input
                  id="indiceCarga"
                  value={formData.indiceCarga}
                  onChange={(e) => handleInputChange('indiceCarga', e.target.value)}
                  placeholder="ex: 99"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="indiceVelocidade">Índice Velocidade</Label>
                <Input
                  id="indiceVelocidade"
                  value={formData.indiceVelocidade}
                  onChange={(e) => handleInputChange('indiceVelocidade', e.target.value)}
                  placeholder="ex: W"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Terceira linha - Nome do produto */}
            <div>
              <Label htmlFor="produto">Nome do Produto *</Label>
              <Input
                id="produto"
                value={formData.produto}
                onChange={(e) => handleInputChange('produto', e.target.value)}
                placeholder="ex: Pneu 235/45R19 99W Sunset Ventura HP B1"
                className="focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Quarta linha - Estoque e Custo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estoque">Estoque Inicial</Label>
                <Input
                  id="estoque"
                  type="number"
                  value={formData.estoque}
                  onChange={(e) => handleInputChange('estoque', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="custo">Custo (R$)</Label>
                <Input
                  id="custo"
                  type="number"
                  step="0.01"
                  value={formData.custo}
                  onChange={(e) => handleInputChange('custo', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Informações adicionais sobre o pneu..."
                className="focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Botão de salvar */}
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8"
              >
                <Save className="w-4 h-4 mr-2" />
                Cadastrar Pneu
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
