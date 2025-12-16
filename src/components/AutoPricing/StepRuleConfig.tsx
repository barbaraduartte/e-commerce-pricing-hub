import React from 'react';
import { TrendingDown, Percent, Package, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PricingRule, 
  RuleType, 
  RULE_TYPE_LABELS,
  CompetitorBasedParams,
  StockBasedParams,
  MarginBasedParams,
  BuyboxOptimizationParams,
  MARKETPLACE_LABELS,
  Marketplace
} from '@/types/autoPricing';
import { cn } from '@/lib/utils';

interface StepRuleConfigProps {
  data: Partial<PricingRule>;
  onChange: (updates: Partial<PricingRule>) => void;
}

const ruleTypeIcons: Record<RuleType, React.ReactNode> = {
  competitor_based: <TrendingDown className="w-5 h-5" />,
  margin_based: <Percent className="w-5 h-5" />,
  stock_based: <Package className="w-5 h-5" />,
  buybox_optimization: <Trophy className="w-5 h-5" />,
  composite: <Percent className="w-5 h-5" />,
};

const ruleTypeDescriptions: Record<RuleType, string> = {
  competitor_based: 'Ajusta preços baseado nos concorrentes',
  margin_based: 'Mantém uma margem alvo específica',
  stock_based: 'Ajusta preços baseado no nível de estoque',
  buybox_optimization: 'Otimiza para ganhar o Buy Box',
  composite: 'Combina múltiplas regras',
};

export const StepRuleConfig: React.FC<StepRuleConfigProps> = ({ data, onChange }) => {
  const ruleType = data.ruleType || 'competitor_based';
  const params = data.ruleParameters || {};

  const updateRuleType = (type: RuleType) => {
    onChange({ 
      ruleType: type,
      ruleParameters: getDefaultParams(type),
    });
  };

  const updateParams = (updates: Partial<typeof params>) => {
    onChange({ ruleParameters: { ...params, ...updates } });
  };

  const getDefaultParams = (type: RuleType) => {
    switch (type) {
      case 'competitor_based':
        return {
          competitorBased: {
            strategy: 'undercut' as const,
            adjustmentType: 'percent' as const,
            adjustmentValue: 2,
            minDifferenceToAct: 1,
            competitorSource: 'lowest' as const,
          },
        };
      case 'margin_based':
        return {
          marginBased: {
            targetMargin: 15,
            tolerance: 2,
            includeFreight: true,
            includeTaxes: true,
          },
        };
      case 'stock_based':
        return {
          stockBased: {
            highStockThreshold: 50,
            highStockDiscountPercent: 5,
            lowStockThreshold: 5,
            lowStockPremiumPercent: 3,
            usesDaysOfStock: false,
          },
        };
      case 'buybox_optimization':
        return {
          buyboxOptimization: {
            targetMarketplace: 'mercadolivre_classico' as Marketplace,
            maxDiscountForBuybox: 10,
            minMarginForBuybox: 8,
          },
        };
      default:
        return {};
    }
  };

  const renderCompetitorConfig = () => {
    const config = params.competitorBased || getDefaultParams('competitor_based').competitorBased!;
    
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Estratégia</Label>
          <RadioGroup
            value={config.strategy}
            onValueChange={(v) => updateParams({ 
              competitorBased: { ...config, strategy: v as 'match' | 'undercut' | 'premium' } 
            })}
            className="grid grid-cols-3 gap-4"
          >
            <Label
              htmlFor="match"
              className={cn(
                "flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent",
                config.strategy === 'match' && "border-primary bg-primary/5"
              )}
            >
              <RadioGroupItem value="match" id="match" className="sr-only" />
              <span className="font-medium">Igualar</span>
              <span className="text-xs text-muted-foreground text-center">Mesmo preço</span>
            </Label>
            <Label
              htmlFor="undercut"
              className={cn(
                "flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent",
                config.strategy === 'undercut' && "border-primary bg-primary/5"
              )}
            >
              <RadioGroupItem value="undercut" id="undercut" className="sr-only" />
              <span className="font-medium">Abaixo</span>
              <span className="text-xs text-muted-foreground text-center">Mais barato</span>
            </Label>
            <Label
              htmlFor="premium"
              className={cn(
                "flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent",
                config.strategy === 'premium' && "border-primary bg-primary/5"
              )}
            >
              <RadioGroupItem value="premium" id="premium" className="sr-only" />
              <span className="font-medium">Acima</span>
              <span className="text-xs text-muted-foreground text-center">Mais caro</span>
            </Label>
          </RadioGroup>
        </div>

        {config.strategy !== 'match' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Ajuste</Label>
              <Select
                value={config.adjustmentType}
                onValueChange={(v) => updateParams({
                  competitorBased: { ...config, adjustmentType: v as 'percent' | 'fixed' }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentual (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor do Ajuste</Label>
              <Input
                type="number"
                value={config.adjustmentValue}
                onChange={(e) => updateParams({
                  competitorBased: { ...config, adjustmentValue: Number(e.target.value) }
                })}
                min={0}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Só agir se diferença for maior que (%)</Label>
          <Input
            type="number"
            value={config.minDifferenceToAct}
            onChange={(e) => updateParams({
              competitorBased: { ...config, minDifferenceToAct: Number(e.target.value) }
            })}
            min={0}
            max={100}
          />
          <p className="text-xs text-muted-foreground">
            Evita alterações desnecessárias para pequenas diferenças de preço
          </p>
        </div>

        <div className="space-y-2">
          <Label>Fonte do Preço Concorrente</Label>
          <Select
            value={config.competitorSource}
            onValueChange={(v) => updateParams({
              competitorBased: { ...config, competitorSource: v as 'lowest' | 'average' | 'specific' }
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowest">Menor preço</SelectItem>
              <SelectItem value="average">Preço médio</SelectItem>
              <SelectItem value="specific">Concorrente específico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderStockConfig = () => {
    const config = params.stockBased || getDefaultParams('stock_based').stockBased!;
    
    return (
      <div className="space-y-6">
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Estoque Alto → Reduzir Preço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Threshold (unidades)</Label>
                <Input
                  type="number"
                  value={config.highStockThreshold}
                  onChange={(e) => updateParams({
                    stockBased: { ...config, highStockThreshold: Number(e.target.value) }
                  })}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Desconto (%)</Label>
                <Input
                  type="number"
                  value={config.highStockDiscountPercent}
                  onChange={(e) => updateParams({
                    stockBased: { ...config, highStockDiscountPercent: Number(e.target.value) }
                  })}
                  min={0}
                  max={50}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Estoque Baixo → Aumentar Preço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Threshold (unidades)</Label>
                <Input
                  type="number"
                  value={config.lowStockThreshold}
                  onChange={(e) => updateParams({
                    stockBased: { ...config, lowStockThreshold: Number(e.target.value) }
                  })}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Aumento (%)</Label>
                <Input
                  type="number"
                  value={config.lowStockPremiumPercent}
                  onChange={(e) => updateParams({
                    stockBased: { ...config, lowStockPremiumPercent: Number(e.target.value) }
                  })}
                  min={0}
                  max={50}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMarginConfig = () => {
    const config = params.marginBased || getDefaultParams('margin_based').marginBased!;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Margem Alvo (%)</Label>
            <Input
              type="number"
              value={config.targetMargin}
              onChange={(e) => updateParams({
                marginBased: { ...config, targetMargin: Number(e.target.value) }
              })}
              min={0}
              max={100}
            />
          </div>
          <div className="space-y-2">
            <Label>Tolerância (+/- %)</Label>
            <Input
              type="number"
              value={config.tolerance}
              onChange={(e) => updateParams({
                marginBased: { ...config, tolerance: Number(e.target.value) }
              })}
              min={0}
              max={20}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Incluir Frete no Cálculo</Label>
              <p className="text-xs text-muted-foreground">Considera o custo de frete na margem</p>
            </div>
            <Switch
              checked={config.includeFreight}
              onCheckedChange={(v) => updateParams({
                marginBased: { ...config, includeFreight: v }
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Incluir Impostos no Cálculo</Label>
              <p className="text-xs text-muted-foreground">Considera impostos na margem</p>
            </div>
            <Switch
              checked={config.includeTaxes}
              onCheckedChange={(v) => updateParams({
                marginBased: { ...config, includeTaxes: v }
              })}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderBuyboxConfig = () => {
    const config = params.buyboxOptimization || getDefaultParams('buybox_optimization').buyboxOptimization!;
    
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Marketplace Alvo</Label>
          <Select
            value={config.targetMarketplace}
            onValueChange={(v) => updateParams({
              buyboxOptimization: { ...config, targetMarketplace: v as Marketplace }
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MARKETPLACE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Desconto Máximo para Buy Box (%)</Label>
            <Input
              type="number"
              value={config.maxDiscountForBuybox}
              onChange={(e) => updateParams({
                buyboxOptimization: { ...config, maxDiscountForBuybox: Number(e.target.value) }
              })}
              min={0}
              max={30}
            />
          </div>
          <div className="space-y-2">
            <Label>Margem Mínima (%)</Label>
            <Input
              type="number"
              value={config.minMarginForBuybox}
              onChange={(e) => updateParams({
                buyboxOptimization: { ...config, minMarginForBuybox: Number(e.target.value) }
              })}
              min={0}
              max={50}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
          💡 Esta regra tentará ajustar o preço para ganhar o Buy Box, respeitando os limites de desconto e margem mínima configurados.
        </p>
      </div>
    );
  };

  const renderRuleConfig = () => {
    switch (ruleType) {
      case 'competitor_based':
        return renderCompetitorConfig();
      case 'stock_based':
        return renderStockConfig();
      case 'margin_based':
        return renderMarginConfig();
      case 'buybox_optimization':
        return renderBuyboxConfig();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Rule Type Selection */}
      <div className="space-y-3">
        <Label>Tipo de Regra</Label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(['competitor_based', 'stock_based', 'margin_based', 'buybox_optimization'] as RuleType[]).map(type => (
            <Card
              key={type}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                ruleType === type && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => updateRuleType(type)}
            >
              <CardContent className="pt-4 text-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2",
                  ruleType === type ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {ruleTypeIcons[type]}
                </div>
                <div className="font-medium text-sm">{RULE_TYPE_LABELS[type]}</div>
                <div className="text-xs text-muted-foreground mt-1">{ruleTypeDescriptions[type]}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Rule Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurar {RULE_TYPE_LABELS[ruleType]}</CardTitle>
          <CardDescription>{ruleTypeDescriptions[ruleType]}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderRuleConfig()}
        </CardContent>
      </Card>
    </div>
  );
};
