import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calculator, Save, RotateCcw, Settings, Truck, Upload, Search, Edit3 } from 'lucide-react';
import { usePricing } from '../contexts/PricingContext';
import { useShipping } from '../contexts/ShippingContext';
import { useProducts } from '../contexts/ProductContext';
import { StateTaxConfiguration } from './StateTaxConfiguration';
import { TireFreightConfiguration } from './TireFreightConfiguration';
import { useToast } from '@/hooks/use-toast';

export const PricingCalculator: React.FC = () => {
  const { platforms, updatePlatformCommission } = usePricing();
  const { getCurrentStateTaxes, calculateFreight } = useShipping();
  const { products } = useProducts();
  const { toast } = useToast();
  
  const [selectedSku, setSelectedSku] = useState<string>('');
  const [skuSearch, setSkuSearch] = useState<string>('');
  const [custo, setCusto] = useState<string>('');
  const [margemDesejada, setMargemDesejada] = useState<string>('');
  const [precoDesejado, setPrecoDesejado] = useState<string>('');
  const [calculoTipo, setCalculoTipo] = useState<'margem' | 'preco'>('margem');
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [editingPrices, setEditingPrices] = useState<{[key: string]: string}>({});
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  
  const [editingCommissions, setEditingCommissions] = useState<{[key: string]: string}>({});

  // Filtrar produtos baseado na busca
  const filteredProducts = products.filter(product => 
    product.sku.toLowerCase().includes(skuSearch.toLowerCase()) ||
    product.produto.toLowerCase().includes(skuSearch.toLowerCase())
  );

  // Atualizar custo quando SKU é selecionado
  useEffect(() => {
    if (selectedSku) {
      const produto = products.find(p => p.sku === selectedSku);
      if (produto) {
        setCusto(produto.custo.toString());
      }
    }
  }, [selectedSku, products]);

  // Função para lidar com a seleção por busca de texto
  const handleSkuSearchSelect = (sku: string) => {
    setSelectedSku(sku);
    setSkuSearch(sku);
  };

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

  const calcularMargemPorPreco = (precoDesejadoValue: number, custoValue: number, frete: number, comissao: number, impostos: number): number => {
    const custoTotal = custoValue + frete;
    const comissaoValor = precoDesejadoValue * (comissao / 100);
    const impostosValor = precoDesejadoValue * (impostos / 100);
    const lucro = precoDesejadoValue - custoTotal - comissaoValor - impostosValor;
    return (lucro / precoDesejadoValue) * 100;
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

  const handlePriceEdit = (platformName: string, newPrice: string) => {
    setEditingPrices(prev => ({
      ...prev,
      [platformName]: newPrice
    }));
  };

  const handlePriceClick = (platformName: string) => {
    setEditingPlatform(platformName);
  };

  const handlePriceBlur = () => {
    setEditingPlatform(null);
  };

  const handlePriceKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingPlatform(null);
    }
  };

  const getResults = () => {
    const custoValue = parseFloat(custo) || 0;
    const totalTaxes = getCurrentTotalTaxes();
    const freightValue = getFreightValue();

    if (custoValue && ((calculoTipo === 'margem' && margemDesejada) || (calculoTipo === 'preco' && precoDesejado))) {
      return platforms.map(platform => {
        let precoCalculado: number;
        let margemFinal: number;
        
        // Verificar se há preço editado para esta plataforma
        const editedPrice = editingPrices[platform.name];
        if (editedPrice && parseFloat(editedPrice) > 0) {
          precoCalculado = parseFloat(editedPrice);
          margemFinal = calcularMargemReal(precoCalculado, custoValue, freightValue, platform.commission, totalTaxes);
        } else if (calculoTipo === 'margem') {
          const margemValue = parseFloat(margemDesejada) || 0;
          precoCalculado = calcularPreco(custoValue, margemValue, platform.commission, totalTaxes, freightValue);
          margemFinal = calcularMargemReal(precoCalculado, custoValue, freightValue, platform.commission, totalTaxes);
        } else {
          const precoDesejadoValue = parseFloat(precoDesejado) || 0;
          precoCalculado = precoDesejadoValue;
          margemFinal = calcularMargemPorPreco(precoDesejadoValue, custoValue, freightValue, platform.commission, totalTaxes);
        }
        
        return {
          ...platform,
          precoCalculado,
          margemFinal,
          margemDesejada: calculoTipo === 'margem' ? parseFloat(margemDesejada) || 0 : margemFinal,
          precoDesejado: calculoTipo === 'preco' ? parseFloat(precoDesejado) || 0 : precoCalculado,
          frete: freightValue,
        };
      });
    }

    return [];
  };

  const results = getResults();

  const limpar = () => {
    setSelectedSku('');
    setSkuSearch('');
    setCusto('');
    setMargemDesejada('');
    setPrecoDesejado('');
    setEditingPrices({});
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
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  };

  const importarParaMarketplace = (platformName: string, preco: number) => {
    toast({
      title: `Importado para ${platformName}!`,
      description: `Preço ${formatCurrency(preco)} será aplicado no marketplace.`,
      className: "bg-green-50 border-green-200 text-green-800",
    });
  };

  const currentStateTaxes = getCurrentStateTaxes();
  const selectedProduct = products.find(p => p.sku === selectedSku);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Simulador de preço</h1>
          <p className="text-blue-600 mt-2">Selecione um produto pelo SKU e defina a margem ou preço desejado.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowConfig(!showConfig)}
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </Button>
      </div>

      {showConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Comissões das Plataformas</CardTitle>
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
                    className="w-24 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              ))}
              <Button 
                onClick={saveCommissions}
                className="w-full bg-blue-600 hover:bg-blue-700"
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
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Calculator className="w-5 h-5 mr-2" />
              Dados de entrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-blue-800">Buscar produto por SKU</label>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                  <Input
                    placeholder="Digite o SKU ou nome do produto..."
                    value={skuSearch}
                    onChange={(e) => setSkuSearch(e.target.value)}
                    className="pl-10 focus:ring-blue-500 focus:border-blue-500 border-blue-200"
                  />
                </div>
                
                {skuSearch && filteredProducts.length > 0 && (
                  <div className="border border-blue-200 rounded-lg max-h-32 overflow-y-auto">
                    {filteredProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.sku}
                        className="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSkuSearchSelect(product.sku)}
                      >
                        <div className="text-sm font-medium text-blue-900">{product.sku}</div>
                        <div className="text-xs text-blue-600 truncate">{product.produto}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <Select value={selectedSku} onValueChange={setSelectedSku}>
                  <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500 border-blue-200">
                    <SelectValue placeholder="Ou selecione da lista completa" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.sku} value={product.sku}>
                        {product.sku} - {product.produto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedProduct && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-700 mb-2">Produto selecionado:</div>
                <div className="text-sm font-medium text-blue-900">{selectedProduct.produto}</div>
                <div className="text-sm text-blue-700">Marca: {selectedProduct.marca}</div>
                <div className="text-lg font-bold text-green-600 mt-2">
                  Custo: {formatCurrency(selectedProduct.custo)}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Tipo de cálculo:</span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${calculoTipo === 'margem' ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                  Margem desejada
                </span>
                <Switch
                  checked={calculoTipo === 'preco'}
                  onCheckedChange={(checked) => setCalculoTipo(checked ? 'preco' : 'margem')}
                />
                <span className={`text-sm ${calculoTipo === 'preco' ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                  Preço desejado
                </span>
              </div>
            </div>

            {calculoTipo === 'margem' ? (
              <div>
                <label className="text-sm font-medium mb-2 block text-blue-800">Margem desejada (%)</label>
                <Input
                  type="number"
                  placeholder="Ex: 20"
                  value={margemDesejada}
                  onChange={(e) => setMargemDesejada(e.target.value)}
                  step="0.1"
                  className="focus:ring-blue-500 focus:border-blue-500 border-blue-200"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium mb-2 block text-blue-800">Preço pesejado (R$)</label>
                <Input
                  type="number"
                  placeholder="Ex: 450.00"
                  value={precoDesejado}
                  onChange={(e) => setPrecoDesejado(e.target.value)}
                  step="0.01"
                  className="focus:ring-blue-500 focus:border-blue-500 border-blue-200"
                />
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-700 mb-2 flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Frete Calculado (ML)
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(getFreightValue())}
              </div>
            </div>

            <Button onClick={limpar} variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Resultados por plataforma</CardTitle>
            {currentStateTaxes && (
              <div className="text-sm text-blue-600">
                Estado: {currentStateTaxes.stateName} ({getCurrentTotalTaxes().toFixed(2)}% impostos)
              </div>
            )}
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge className={result.color}>{result.name}</Badge>
                      <span className="text-sm text-blue-600">
                        Comissão: {result.commission}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-blue-600 mb-1 flex items-center">
                          Preço final
                          <Edit3 className="w-3 h-3 ml-1 text-blue-400" />
                        </div>
                        {editingPlatform === result.name ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editingPrices[result.name] || result.precoCalculado.toFixed(2)}
                            onChange={(e) => handlePriceEdit(result.name, e.target.value)}
                            onBlur={handlePriceBlur}
                            onKeyPress={handlePriceKeyPress}
                            className="text-lg font-bold text-green-600 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                        ) : (
                          <div
                            className="text-lg font-bold text-green-600 cursor-pointer hover:bg-blue-50 p-2 rounded border-2 border-transparent hover:border-blue-200 transition-all"
                            onClick={() => handlePriceClick(result.name)}
                          >
                            {formatCurrency(result.precoCalculado)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-blue-600">Margem real</div>
                        <div className={`text-lg font-bold ${result.margemFinal >= 15 ? 'text-green-600' : result.margemFinal >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {result.margemFinal.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600">
                        {calculoTipo === 'margem' ? 'Margem Desejada:' : 'Preço desejado:'}
                      </span>
                      <span className="font-medium">
                        {calculoTipo === 'margem' 
                          ? `${result.margemDesejada.toFixed(1)}%`
                          : formatCurrency(result.precoDesejado)
                        }
                      </span>
                    </div>
                    
                    <div className="text-xs text-blue-500 bg-blue-50 p-2 rounded space-y-1">
                      <div>Custo + Frete: {formatCurrency((parseFloat(custo) || 0) + result.frete)}</div>
                      <div>Impostos: {getCurrentTotalTaxes().toFixed(2)}%</div>
                      <div>Frete: {formatCurrency(result.frete)}</div>
                    </div>

                    <Button 
                      onClick={() => importarParaMarketplace(result.name, result.precoCalculado)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importar para {result.name}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-blue-500 py-8">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                <p>Selecione um produto e defina {calculoTipo === 'margem' ? 'a margem' : 'o preço'} para ver os resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Resumo de configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platforms.map((platform, index) => (
              <div key={index} className="border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Badge className={platform.color}>{platform.name}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Taxa da plataforma:</span>
                    <span className="font-medium text-blue-900">{platform.commission}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Impostos totais:</span>
                    <span className="font-medium text-blue-900">{getCurrentTotalTaxes().toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Frete ML:</span>
                    <span className="font-medium text-blue-900">{formatCurrency(getFreightValue())}</span>
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
