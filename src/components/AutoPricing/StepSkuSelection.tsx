import React, { useState } from 'react';
import { Search, X, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/contexts/ProductContext';
import { PricingRule, SkuSelection, MARKETPLACE_LABELS, Marketplace } from '@/types/autoPricing';

interface StepSkuSelectionProps {
  data: Partial<PricingRule>;
  onChange: (updates: Partial<PricingRule>) => void;
}

export const StepSkuSelection: React.FC<StepSkuSelectionProps> = ({ data, onChange }) => {
  const { products, getAllBrands } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [manualSkuInput, setManualSkuInput] = useState('');

  const brands = getAllBrands();
  const marketplaces: Marketplace[] = ['mercadolivre_classico', 'mercadolivre_premium', 'magalu'];

  const selectionType = data.skuSelection?.type || 'filter';
  const filters = data.skuSelection?.filters || {};
  const manualSkus = data.skuSelection?.manualSkus || [];

  const updateSelection = (updates: Partial<SkuSelection>) => {
    onChange({
      skuSelection: {
        ...data.skuSelection,
        ...updates,
      } as SkuSelection,
    });
  };

  const handleTypeChange = (type: 'manual' | 'filter') => {
    updateSelection({ type });
  };

  const addManualSku = () => {
    if (manualSkuInput.trim()) {
      const newSkus = manualSkuInput
        .split(/[,\s\n]+/)
        .map(s => s.trim())
        .filter(s => s && !manualSkus.includes(s));
      
      if (newSkus.length > 0) {
        updateSelection({ manualSkus: [...manualSkus, ...newSkus] });
      }
      setManualSkuInput('');
    }
  };

  const removeManualSku = (sku: string) => {
    updateSelection({ manualSkus: manualSkus.filter(s => s !== sku) });
  };

  const toggleBrand = (brand: string) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    updateSelection({
      type: 'filter',
      filters: { ...filters, brands: newBrands.length > 0 ? newBrands : undefined },
    });
  };

  const toggleMarketplace = (marketplace: Marketplace) => {
    const currentMarketplaces = filters.marketplaces || [];
    const newMarketplaces = currentMarketplaces.includes(marketplace)
      ? currentMarketplaces.filter(m => m !== marketplace)
      : [...currentMarketplaces, marketplace];
    
    updateSelection({
      type: 'filter',
      filters: { ...filters, marketplaces: newMarketplaces.length > 0 ? newMarketplaces : undefined },
    });
  };

  const updatePriceRange = (values: number[]) => {
    updateSelection({
      type: 'filter',
      filters: { ...filters, priceRange: { min: values[0], max: values[1] } },
    });
  };

  const updateStockRange = (values: number[]) => {
    updateSelection({
      type: 'filter',
      filters: { ...filters, stockRange: { min: values[0], max: values[1] } },
    });
  };

  const updateMarginRange = (values: number[]) => {
    updateSelection({
      type: 'filter',
      filters: { ...filters, marginRange: { min: values[0], max: values[1] } },
    });
  };

  // Calcular SKUs que serão afetados pelos filtros
  const getMatchingSkusCount = () => {
    if (selectionType === 'manual') {
      return manualSkus.length;
    }

    let matching = products;
    
    if (filters.brands?.length) {
      matching = matching.filter(p => filters.brands!.includes(p.marca));
    }
    if (filters.priceRange) {
      matching = matching.filter(p => 
        p.precoMagalu >= filters.priceRange!.min && 
        p.precoMagalu <= filters.priceRange!.max
      );
    }
    if (filters.stockRange) {
      matching = matching.filter(p =>
        p.estoque >= filters.stockRange!.min &&
        p.estoque <= filters.stockRange!.max
      );
    }
    if (filters.marginRange) {
      matching = matching.filter(p =>
        p.margemMagalu >= filters.marginRange!.min &&
        p.margemMagalu <= filters.marginRange!.max
      );
    }

    return matching.length;
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectionType} onValueChange={(v) => handleTypeChange(v as 'manual' | 'filter')}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="filter" className="gap-2">
            <Filter className="w-4 h-4" />
            Por Filtros
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <Search className="w-4 h-4" />
            Lista Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filter" className="space-y-6 mt-6">
          {/* Brands */}
          <div className="space-y-3">
            <Label>Marcas</Label>
            <div className="flex flex-wrap gap-2">
              {brands.map(brand => (
                <Badge
                  key={brand}
                  variant={filters.brands?.includes(brand) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleBrand(brand)}
                >
                  {brand}
                </Badge>
              ))}
            </div>
          </div>

          {/* Marketplaces */}
          <div className="space-y-3">
            <Label>Marketplaces</Label>
            <div className="flex flex-wrap gap-2">
              {marketplaces.map(mp => (
                <Badge
                  key={mp}
                  variant={filters.marketplaces?.includes(mp) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleMarketplace(mp)}
                >
                  {MARKETPLACE_LABELS[mp]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Faixa de Preço</Label>
              <span className="text-sm text-muted-foreground">
                R$ {filters.priceRange?.min || 0} - R$ {filters.priceRange?.max || 5000}
              </span>
            </div>
            <Slider
              value={[filters.priceRange?.min || 0, filters.priceRange?.max || 5000]}
              onValueChange={updatePriceRange}
              min={0}
              max={5000}
              step={50}
            />
          </div>

          {/* Stock Range */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Estoque</Label>
              <span className="text-sm text-muted-foreground">
                {filters.stockRange?.min || 0} - {filters.stockRange?.max || 500} unidades
              </span>
            </div>
            <Slider
              value={[filters.stockRange?.min || 0, filters.stockRange?.max || 500]}
              onValueChange={updateStockRange}
              min={0}
              max={500}
              step={5}
            />
          </div>

          {/* Margin Range */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Margem Atual</Label>
              <span className="text-sm text-muted-foreground">
                {filters.marginRange?.min || 0}% - {filters.marginRange?.max || 50}%
              </span>
            </div>
            <Slider
              value={[filters.marginRange?.min || 0, filters.marginRange?.max || 50]}
              onValueChange={updateMarginRange}
              min={0}
              max={50}
              step={1}
            />
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label>Adicionar SKUs</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Digite SKUs separados por vírgula ou espaço..."
                value={manualSkuInput}
                onChange={(e) => setManualSkuInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addManualSku()}
              />
              <Button onClick={addManualSku} className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* SKU List */}
          {manualSkus.length > 0 && (
            <div className="space-y-2">
              <Label>SKUs Selecionados ({manualSkus.length})</Label>
              <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg max-h-[200px] overflow-y-auto">
                {manualSkus.map(sku => (
                  <Badge key={sku} variant="secondary" className="gap-1">
                    {sku}
                    <button onClick={() => removeManualSku(sku)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Quick select from products */}
          <div className="space-y-2">
            <Label>Ou selecione do catálogo</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {products
                .filter(p => 
                  p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.produto.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 10)
                .map(product => (
                  <div
                    key={product.sku}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => {
                      if (!manualSkus.includes(product.sku)) {
                        updateSelection({ manualSkus: [...manualSkus, product.sku] });
                      }
                    }}
                  >
                    <Checkbox checked={manualSkus.includes(product.sku)} />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm">{product.sku}</div>
                      <div className="text-sm text-muted-foreground truncate">{product.produto}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">SKUs que serão afetados:</span>
            <span className="text-2xl font-bold text-primary">{getMatchingSkusCount()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
