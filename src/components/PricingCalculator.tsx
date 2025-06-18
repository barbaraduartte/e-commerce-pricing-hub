
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, Save, RotateCcw } from 'lucide-react';

interface PlatformConfig {
  name: string;
  commission: number;
  color: string;
}

const platforms: PlatformConfig[] = [
  { name: 'Magalu', commission: 12.5, color: 'bg-blue-100 text-blue-800' },
  { name: 'ML Clássico', commission: 15.0, color: 'bg-green-100 text-green-800' },
  { name: 'ML Premium', commission: 18.0, color: 'bg-purple-100 text-purple-800' },
];

export const PricingCalculator: React.FC = () => {
  const [custo, setCusto] = useState<string>('');
  const [margemDesejada, setMargemDesejada] = useState<string>('');
  const [precoFinal, setPrecoFinal] = useState<string>('');
  const [calculationMode, setCalculationMode] = useState<'margin-to-price' | 'price-to-margin'>('margin-to-price');

  const calcularPreco = (custoValue: number, margemValue: number, comissao: number): number => {
    // Preço = Custo / (1 - (Margem + Comissão) / 100)
    return custoValue / (1 - (margemValue + comissao) / 100);
  };

  const calcularMargem = (custoValue: number, precoValue: number, comissao: number): number => {
    // Margem = ((Preço - Custo) / Preço * 100) - Comissão
    return ((precoValue - custoValue) / precoValue * 100) - comissao;
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

    if (calculationMode === 'margin-to-price' && custoValue && margemValue) {
      return platforms.map(platform => ({
        ...platform,
        precoCalculado: calcularPreco(custoValue, margemValue, platform.commission),
        margemFinal: margemValue,
      }));
    } else if (calculationMode === 'price-to-margin' && custoValue && precoValue) {
      return platforms.map(platform => ({
        ...platform,
        precoCalculado: precoValue,
        margemFinal: calcularMargem(custoValue, precoValue, platform.commission),
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calculadora de Precificação</h1>
        <p className="text-gray-600 mt-2">Calcule preços e margens por plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Dados de Entrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Custo do Produto (R$)</label>
              <Input
                type="number"
                placeholder="Ex: 100.00"
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Modo de Cálculo</label>
              <div className="flex space-x-2">
                <Button
                  variant={calculationMode === 'margin-to-price' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCalculationMode('margin-to-price')}
                >
                  Margem → Preço
                </Button>
                <Button
                  variant={calculationMode === 'price-to-margin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCalculationMode('price-to-margin')}
                >
                  Preço → Margem
                </Button>
              </div>
            </div>

            {calculationMode === 'margin-to-price' ? (
              <div>
                <label className="text-sm font-medium mb-2 block">Margem Desejada (%)</label>
                <Input
                  type="number"
                  placeholder="Ex: 20"
                  value={margemDesejada}
                  onChange={(e) => setMargemDesejada(e.target.value)}
                  step="0.1"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium mb-2 block">Preço Final (R$)</label>
                <Input
                  type="number"
                  placeholder="Ex: 150.00"
                  value={precoFinal}
                  onChange={(e) => setPrecoFinal(e.target.value)}
                  step="0.01"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={limpar} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
              <Button className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados por Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge className={result.color}>{result.name}</Badge>
                      <span className="text-sm text-gray-500">
                        Comissão: {result.commission}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Preço Final</div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(result.precoCalculado)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Margem Líquida</div>
                        <div className={`text-lg font-bold ${result.margemFinal >= 15 ? 'text-green-600' : result.margemFinal >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {result.margemFinal.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Preencha os dados para ver os resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações das Plataformas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platforms.map((platform, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Badge className={platform.color}>{platform.name}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Taxa da Plataforma:</span>
                    <span className="font-medium">{platform.commission}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margem Mínima Recomendada:</span>
                    <span className="font-medium">15%</span>
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
