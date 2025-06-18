
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, Save, RotateCcw, Settings, Receipt } from 'lucide-react';
import { usePricing } from '../contexts/PricingContext';
import { useToast } from '@/hooks/use-toast';

export const PricingCalculator: React.FC = () => {
  const { platforms, taxes, updatePlatformCommission, updateTaxes } = usePricing();
  const { toast } = useToast();
  
  const [custo, setCusto] = useState<string>('');
  const [margemDesejada, setMargemDesejada] = useState<string>('');
  const [precoFinal, setPrecoFinal] = useState<string>('');
  const [calculationMode, setCalculationMode] = useState<'margin-to-price' | 'price-to-margin'>('margin-to-price');
  const [showConfig, setShowConfig] = useState<boolean>(false);
  
  // Estados locais para edição
  const [editingCommissions, setEditingCommissions] = useState<{[key: string]: string}>({});
  const [editingTaxes, setEditingTaxes] = useState({
    icms: taxes.icms.toString(),
    ipi: taxes.ipi.toString(),
    pis: taxes.pis.toString(),
    cofins: taxes.cofins.toString(),
  });

  const calcularPreco = (custoValue: number, margemValue: number, comissao: number, impostos: number): number => {
    // Preço = Custo / (1 - (Margem + Comissão + Impostos) / 100)
    return custoValue / (1 - (margemValue + comissao + impostos) / 100);
  };

  const calcularMargem = (custoValue: number, precoValue: number, comissao: number, impostos: number): number => {
    // Margem = ((Preço - Custo) / Preço * 100) - Comissão - Impostos
    return ((precoValue - custoValue) / precoValue * 100) - comissao - impostos;
  };

  const getTotalTaxes = () => {
    return taxes.icms + taxes.ipi + taxes.pis + taxes.cofins;
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
    const precoValue = parseFloat(precoFinal) || 0;
    const totalTaxes = getTotalTaxes();

    if (calculationMode === 'margin-to-price' && custoValue && margemValue) {
      return platforms.map(platform => ({
        ...platform,
        precoCalculado: calcularPreco(custoValue, margemValue, platform.commission, totalTaxes),
        margemFinal: margemValue,
      }));
    } else if (calculationMode === 'price-to-margin' && custoValue && precoValue) {
      return platforms.map(platform => ({
        ...platform,
        precoCalculado: precoValue,
        margemFinal: calcularMargem(custoValue, precoValue, platform.commission, totalTaxes),
      }));
    }

    return [];
  };

  const results = getResults();

  const limpar = () => {
    setCusto('');
    setMargemDesejada('');
    setPrecoFinal('');
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

  const saveTaxes = () => {
    const newTaxes = {
      icms: parseFloat(editingTaxes.icms) || 0,
      ipi: parseFloat(editingTaxes.ipi) || 0,
      pis: parseFloat(editingTaxes.pis) || 0,
      cofins: parseFloat(editingTaxes.cofins) || 0,
    };
    updateTaxes(newTaxes);
    toast({
      title: "Impostos atualizados!",
      description: "As novas alíquotas foram salvas com sucesso.",
      className: "bg-orange-50 border-orange-200 text-orange-800",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-900">Calculadora de Precificação</h1>
          <p className="text-orange-600 mt-2">Calcule preços e margens por plataforma</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Impostos Brasileiros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">ICMS (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingTaxes.icms}
                    onChange={(e) => setEditingTaxes(prev => ({ ...prev, icms: e.target.value }))}
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">IPI (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingTaxes.ipi}
                    onChange={(e) => setEditingTaxes(prev => ({ ...prev, ipi: e.target.value }))}
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">PIS (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingTaxes.pis}
                    onChange={(e) => setEditingTaxes(prev => ({ ...prev, pis: e.target.value }))}
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">COFINS (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingTaxes.cofins}
                    onChange={(e) => setEditingTaxes(prev => ({ ...prev, cofins: e.target.value }))}
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-orange-800">
                  Total de Impostos: {getTotalTaxes().toFixed(2)}%
                </div>
              </div>
              <Button 
                onClick={saveTaxes}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Impostos
              </Button>
            </CardContent>
          </Card>
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

            <div className="space-y-2">
              <label className="text-sm font-medium block text-orange-800">Modo de Cálculo</label>
              <div className="flex space-x-2">
                <Button
                  variant={calculationMode === 'margin-to-price' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCalculationMode('margin-to-price')}
                  className={calculationMode === 'margin-to-price' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}
                >
                  Margem → Preço
                </Button>
                <Button
                  variant={calculationMode === 'price-to-margin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCalculationMode('price-to-margin')}
                  className={calculationMode === 'price-to-margin' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}
                >
                  Preço → Margem
                </Button>
              </div>
            </div>

            {calculationMode === 'margin-to-price' ? (
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
            ) : (
              <div>
                <label className="text-sm font-medium mb-2 block text-orange-800">Preço Final (R$)</label>
                <Input
                  type="number"
                  placeholder="Ex: 150.00"
                  value={precoFinal}
                  onChange={(e) => setPrecoFinal(e.target.value)}
                  step="0.01"
                  className="focus:ring-orange-500 focus:border-orange-500 border-orange-200"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={limpar} variant="outline" className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50">
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800">Resultados por Plataforma</CardTitle>
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
                        <div className="text-sm text-orange-600">Margem Líquida</div>
                        <div className={`text-lg font-bold ${result.margemFinal >= 15 ? 'text-green-600' : result.margemFinal >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {result.margemFinal.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-orange-500 bg-orange-50 p-2 rounded">
                      Impostos incluídos: {getTotalTaxes().toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-orange-500 py-8">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-orange-300" />
                <p>Preencha os dados para ver os resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Informações das Plataformas</CardTitle>
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
                    <span className="font-medium text-orange-900">{getTotalTaxes().toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-700">Margem Mín. Recomendada:</span>
                    <span className="font-medium text-orange-900">15%</span>
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
