
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, Save, RotateCcw, Settings, Truck } from 'lucide-react';
import { usePricing } from '../contexts/PricingContext';
import { useShipping } from '../contexts/ShippingContext';
import { StateTaxConfiguration } from './StateTaxConfiguration';
import { TireFreightConfiguration } from './TireFreightConfiguration';
import { useToast } from '@/hooks/use-toast';

export const PricingCalculator: React.FC = () => {
  const { platforms, updatePlatformCommission } = usePricing();
  const { getCurrentStateTaxes, calculateFreight } = useShipping();
  const { toast } = useToast();
  
  const [custo, setCusto] = useState<string>('');
  const [margemDesejada, setMargemDesejada] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(false);
  
  const [editingCommissions, setEditingCommissions] = useState<{[key: string]: string}>({});

  const calcularPreco = (custoValue: number, margemValue: number, comissao: number, impostos: number, frete: number): number => {
    const custoComFrete = custoValue + frete;
    return custoComFrete / (1 - (margemValue + comissao + impostos) / 100);
  };

  const calcularMargemReal = (precoVenda: number, custoValue: number, frete: number, comissao: number, impostos: number): number => {
    const custoTotal = custoValue + frete;
    const comissaoValor = precoVenda * (comissao / 100);
    const impostosValor = precoVenda * (impostos / 100);
    const lucro = precoVenda - custoTotal - comissaoValor - impostosValor;
    return (lucro / precoVenda) * 100;
  };

  const getCurrentTotalTaxes = () => {
    const stateTaxes = getCurrentStateTaxes();
    if (!stateTaxes) return 0;
    return stateTaxes.taxPercentage;
  };

  const getFreightValue = () => {
    return calculateFreight();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getResults = () => {
    const custoValue = parseFloat(custo) || 0;
    const margemValue = parseFloat(margemDesejada) || 0;
    const totalTaxes = getCurrentTotalTaxes();
    const freightValue = getFreightValue();

    if (custoValue && margemValue) {
      return platforms.map(platform => {
        const precoCalculado = calcularPreco(custoValue, margemValue, platform.commission, totalTaxes, freightValue);
        const margemReal = calcularMargemReal(precoCalculado, custoValue, freightValue, platform.commission, totalTaxes);
        
        return {
          ...platform,
          precoCalculado,
          margemFinal: margemReal,
          margemDesejada: margemValue,
          frete: freightValue,
        };
      });
    }

    return [];
  };

  const results = getResults();

  const limpar = () => {
    setCusto('');
    setMargemDesejada('');
  };

  const saveCommissions = () => {
    Object.entries(editingCommissions).forEach(([platformName, commission]) => {
      if (commission) {
        updatePlatformCommission(platformName, parseFloat(commission));
      }
    });
    setEditingCommissions({});
    toast({
      title: "Comissões atualizadas!",
      description: "As novas comissões foram salvas com sucesso.",
      className: "bg-orange-50 border-orange-200 text-orange-800",
    });
  };

  const currentStateTaxes = getCurrentStateTaxes();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-900">Calculadora de Precificação</h1>
          <p className="text-orange-600 mt-2">Informe o custo e a margem desejada para calcular preços automáticos</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowConfig(!showConfig)}
          className="border-orange-200 text-orange-700 hover:bg-orange-50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </Button>
      </div>

      {showConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Comissões das Plataformas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center space-x-4">
                  <Badge className={platform.color}>{platform.name}</Badge>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder={platform.commission.toString()}
                    value={editingCommissions[platform.name] || ''}
                    onChange={(e) => setEditingCommissions(prev => ({
                      ...prev,
                      [platform.name]: e.target.value
                    }))}
                    className="w-24 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              ))}
              <Button 
                onClick={saveCommissions}
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={Object.keys(editingCommissions).length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Comissões
              </Button>
            </CardContent>
          </Card>

          <StateTaxConfiguration />
          <TireFreightConfiguration />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <Calculator className="w-5 h-5 mr-2" />
              Dados de Entrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-orange-800">Custo do Produto (R$)</label>
              <Input
                type="number"
                placeholder="Ex: 100.00"
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                step="0.01"
                className="focus:ring-orange-500 focus:border-orange-500 border-orange-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-orange-800">Margem Desejada (%)</label>
              <Input
                type="number"
                placeholder="Ex: 20"
                value={margemDesejada}
                onChange={(e) => setMargemDesejada(e.target.value)}
                step="0.1"
                className="focus:ring-orange-500 focus:border-orange-500 border-orange-200"
              />
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-700 mb-2 flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Frete Calculado (ML)
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(getFreightValue())}
              </div>
            </div>

            <Button onClick={limpar} variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800">Resultados por Plataforma</CardTitle>
            {currentStateTaxes && (
              <div className="text-sm text-orange-600">
                Estado: {currentStateTaxes.stateName} ({getCurrentTotalTaxes().toFixed(2)}% impostos)
              </div>
            )}
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border border-orange-200 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge className={result.color}>{result.name}</Badge>
                      <span className="text-sm text-orange-600">
                        Comissão: {result.commission}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-orange-600">Preço Final</div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(result.precoCalculado)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-orange-600">Margem Real</div>
                        <div className={`text-lg font-bold ${result.margemFinal >= 15 ? 'text-green-600' : result.margemFinal >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {result.margemFinal.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-600">Margem Desejada:</span>
                      <span className="font-medium">{result.margemDesejada.toFixed(1)}%</span>
                    </div>
                    
                    <div className="text-xs text-orange-500 bg-orange-50 p-2 rounded space-y-1">
                      <div>Custo + Frete: {formatCurrency((parseFloat(custo) || 0) + result.frete)}</div>
                      <div>Impostos: {getCurrentTotalTaxes().toFixed(2)}%</div>
                      <div>Frete: {formatCurrency(result.frete)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-orange-500 py-8">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-orange-300" />
                <p>Preencha o custo e margem para ver os preços</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Resumo de Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platforms.map((platform, index) => (
              <div key={index} className="border border-orange-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Badge className={platform.color}>{platform.name}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-orange-700">Taxa da Plataforma:</span>
                    <span className="font-medium text-orange-900">{platform.commission}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-700">Impostos Totais:</span>
                    <span className="font-medium text-orange-900">{getCurrentTotalTaxes().toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-700">Frete ML:</span>
                    <span className="font-medium text-orange-900">{formatCurrency(getFreightValue())}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
