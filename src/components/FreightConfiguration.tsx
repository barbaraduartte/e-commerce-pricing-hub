
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Truck, Save, Calculator } from 'lucide-react';
import { useShipping } from '../contexts/ShippingContext';
import { useToast } from '@/hooks/use-toast';

export const FreightConfiguration: React.FC = () => {
  const { freightConfig, updateFreightConfig, calculateFreight } = useShipping();
  const { toast } = useToast();
  
  const [editingConfig, setEditingConfig] = useState({
    length: freightConfig.length.toString(),
    width: freightConfig.width.toString(),
    height: freightConfig.height.toString(),
    weight: freightConfig.weight.toString(),
    pricePerKm: freightConfig.pricePerKm.toString(),
    baseCost: freightConfig.baseCost.toString(),
  });

  const [testDistance, setTestDistance] = useState<string>('100');

  const saveConfig = () => {
    const newConfig = {
      length: parseFloat(editingConfig.length) || 0,
      width: parseFloat(editingConfig.width) || 0,
      height: parseFloat(editingConfig.height) || 0,
      weight: parseFloat(editingConfig.weight) || 0,
      pricePerKm: parseFloat(editingConfig.pricePerKm) || 0,
      baseCost: parseFloat(editingConfig.baseCost) || 0,
    };
    updateFreightConfig(newConfig);
    toast({
      title: "Configuração de frete atualizada!",
      description: "As novas configurações foram salvas com sucesso.",
      className: "bg-orange-50 border-orange-200 text-orange-800",
    });
  };

  const getVolumetricWeight = () => {
    const length = parseFloat(editingConfig.length) || 0;
    const width = parseFloat(editingConfig.width) || 0;
    const height = parseFloat(editingConfig.height) || 0;
    return (length * width * height) / 6000;
  };

  const getFinalWeight = () => {
    const actualWeight = parseFloat(editingConfig.weight) || 0;
    const volumetricWeight = getVolumetricWeight();
    return Math.max(actualWeight, volumetricWeight);
  };

  const testFreightCalculation = () => {
    const distance = parseFloat(testDistance) || 0;
    return calculateFreight(distance);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          Configuração de Frete Mercado Livre
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Comprimento (cm)</label>
            <Input
              type="number"
              step="0.1"
              value={editingConfig.length}
              onChange={(e) => setEditingConfig(prev => ({ ...prev, length: e.target.value }))}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Largura (cm)</label>
            <Input
              type="number"
              step="0.1"
              value={editingConfig.width}
              onChange={(e) => setEditingConfig(prev => ({ ...prev, width: e.target.value }))}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Altura (cm)</label>
            <Input
              type="number"
              step="0.1"
              value={editingConfig.height}
              onChange={(e) => setEditingConfig(prev => ({ ...prev, height: e.target.value }))}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Peso Real (kg)</label>
            <Input
              type="number"
              step="0.1"
              value={editingConfig.weight}
              onChange={(e) => setEditingConfig(prev => ({ ...prev, weight: e.target.value }))}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Preço por KM (R$)</label>
            <Input
              type="number"
              step="0.01"
              value={editingConfig.pricePerKm}
              onChange={(e) => setEditingConfig(prev => ({ ...prev, pricePerKm: e.target.value }))}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Custo Base (R$)</label>
            <Input
              type="number"
              step="0.01"
              value={editingConfig.baseCost}
              onChange={(e) => setEditingConfig(prev => ({ ...prev, baseCost: e.target.value }))}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg space-y-2">
          <div className="text-sm">
            <strong>Peso Volumétrico:</strong> {getVolumetricWeight().toFixed(2)} kg
          </div>
          <div className="text-sm">
            <strong>Peso Final (maior entre real e volumétrico):</strong> {getFinalWeight().toFixed(2)} kg
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2 text-orange-800">Teste de Cálculo</h4>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Distância (km)"
              value={testDistance}
              onChange={(e) => setTestDistance(e.target.value)}
              className="w-32 focus:ring-orange-500 focus:border-orange-500"
            />
            <span className="text-sm text-gray-600">km =</span>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(testFreightCalculation())}
            </div>
          </div>
        </div>

        <Button 
          onClick={saveConfig}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configuração de Frete
        </Button>
      </CardContent>
    </Card>
  );
};
