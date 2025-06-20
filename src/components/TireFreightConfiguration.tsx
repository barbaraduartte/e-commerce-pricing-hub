
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Save, Calculator } from 'lucide-react';
import { useShipping } from '../contexts/ShippingContext';
import { useToast } from '@/hooks/use-toast';

export const TireFreightConfiguration: React.FC = () => {
  const { tireConfig, updateTireConfig, calculateFreight, calculateVolumetricWeight } = useShipping();
  const { toast } = useToast();
  
  const [editingConfig, setEditingConfig] = useState({
    width: tireConfig.width.toString(),
    height: tireConfig.height.toString(),
    diameter: tireConfig.diameter.toString(),
    quantity: tireConfig.quantity.toString(),
  });

  const saveConfig = () => {
    const newConfig = {
      width: parseFloat(editingConfig.width) || 0,
      height: parseFloat(editingConfig.height) || 0,
      diameter: parseFloat(editingConfig.diameter) || 0,
      quantity: parseInt(editingConfig.quantity) || 1,
    };
    updateTireConfig(newConfig);
    toast({
      title: "Configuração do pneu atualizada!",
      description: "As medidas foram salvas e o frete foi recalculado.",
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Configuração do Pneu - Frete ML
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Largura</label>
            <Input
              type="number"
              placeholder="Ex: 235"
              value={editingConfig.width}
              onChange={(e) => setEditingConfig(prev => ({ ...prev, width: e.target.value }))}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Altura</label>
            <Input
              type="number"
              placeholder="Ex: 50"
              value={editingConfig.height}
              onChange={(e) => setEditingConfig(prev => ({ ...prev, height: e.target.value }))}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Aro</label>
            <Input
              type="number"
              placeholder="Ex: 19"
              value={editingConfig.diameter}
              onChange={(e) => setEditingConfig(prev => ({ ...prev, diameter: e.target.value }))}
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Quantidade</label>
            <Select 
              value={editingConfig.quantity} 
              onValueChange={(value) => setEditingConfig(prev => ({ ...prev, quantity: value }))}
            >
              <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 pneu</SelectItem>
                <SelectItem value="2">2 pneus</SelectItem>
                <SelectItem value="4">4 pneus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <div className="text-sm">
            <strong>Peso Volumétrico:</strong> {calculateVolumetricWeight().toFixed(4)} kg
          </div>
          <div className="text-lg font-bold text-green-600">
            <strong>Frete Calculado:</strong> {formatCurrency(calculateFreight())}
          </div>
        </div>

        <Button 
          onClick={saveConfig}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configuração do Pneu
        </Button>
      </CardContent>
    </Card>
  );
};
