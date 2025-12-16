import React, { useState } from 'react';
import { Pencil, Play, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProducts } from '@/contexts/ProductContext';
import { useAutoPricing } from '@/contexts/AutoPricingContext';
import { 
  PricingRule, 
  RULE_TYPE_LABELS, 
  SCHEDULE_LABELS,
  SimulationResult,
  SimulationSummary,
  MARKETPLACE_LABELS
} from '@/types/autoPricing';

interface StepReviewProps {
  data: Partial<PricingRule>;
  onEdit: (step: number) => void;
}

export const StepReview: React.FC<StepReviewProps> = ({ data, onEdit }) => {
  const { products } = useProducts();
  const { competitorPrices, setCurrentSimulation } = useAutoPricing();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationSummary | null>(null);

  const getMatchingProducts = () => {
    if (data.skuSelection?.type === 'manual') {
      return products.filter(p => data.skuSelection?.manualSkus?.includes(p.sku));
    }

    let matching = [...products];
    const filters = data.skuSelection?.filters;

    if (filters?.brands?.length) {
      matching = matching.filter(p => filters.brands!.includes(p.marca));
    }
    if (filters?.priceRange) {
      matching = matching.filter(p => 
        p.precoMagalu >= filters.priceRange!.min && 
        p.precoMagalu <= filters.priceRange!.max
      );
    }
    if (filters?.stockRange) {
      matching = matching.filter(p =>
        p.estoque >= filters.stockRange!.min &&
        p.estoque <= filters.stockRange!.max
      );
    }

    return matching;
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    const matchingProducts = getMatchingProducts();
    const results: SimulationResult[] = [];

    matchingProducts.forEach(product => {
      // Lógica de simulação baseada no tipo de regra
      const currentPrice = product.precoMagalu;
      let suggestedPrice = currentPrice;
      let reason = '';
      let status: SimulationResult['status'] = 'no_change';

      if (data.ruleType === 'competitor_based' && data.ruleParameters?.competitorBased) {
        const config = data.ruleParameters.competitorBased;
        const competitorPrice = competitorPrices.find(cp => cp.sku === product.sku);
        
        if (competitorPrice) {
          if (config.strategy === 'undercut') {
            const adjustment = config.adjustmentType === 'percent'
              ? competitorPrice.competitorPrice * (1 - config.adjustmentValue / 100)
              : competitorPrice.competitorPrice - config.adjustmentValue;
            
            suggestedPrice = Math.round(adjustment * 100) / 100;
            reason = `Ajuste para ficar ${config.adjustmentValue}${config.adjustmentType === 'percent' ? '%' : 'R$'} abaixo do concorrente (R$ ${competitorPrice.competitorPrice.toFixed(2)})`;
            status = 'will_change';
          }
        } else {
          reason = 'Sem dados de concorrente';
          status = 'no_change';
        }
      } else if (data.ruleType === 'stock_based' && data.ruleParameters?.stockBased) {
        const config = data.ruleParameters.stockBased;
        
        if (product.estoque >= config.highStockThreshold) {
          suggestedPrice = currentPrice * (1 - config.highStockDiscountPercent / 100);
          reason = `Estoque alto (${product.estoque} un.) - aplicando desconto de ${config.highStockDiscountPercent}%`;
          status = 'will_change';
        } else if (product.estoque <= config.lowStockThreshold) {
          suggestedPrice = currentPrice * (1 + config.lowStockPremiumPercent / 100);
          reason = `Estoque baixo (${product.estoque} un.) - aplicando aumento de ${config.lowStockPremiumPercent}%`;
          status = 'will_change';
        } else {
          reason = 'Estoque dentro da faixa normal';
          status = 'no_change';
        }
      }

      // Aplicar safeguards
      const minPriceByMargin = product.custo * (1 + (data.safeguards?.minMargin || 10) / 100);
      if (suggestedPrice < minPriceByMargin) {
        status = 'blocked';
        reason = `Bloqueado: preço sugerido (R$ ${suggestedPrice.toFixed(2)}) abaixo da margem mínima`;
        suggestedPrice = currentPrice;
      }

      const maxChange = currentPrice * (data.safeguards?.maxChangePercent || 5) / 100;
      if (Math.abs(suggestedPrice - currentPrice) > maxChange && status === 'will_change') {
        suggestedPrice = suggestedPrice > currentPrice 
          ? currentPrice + maxChange 
          : currentPrice - maxChange;
        reason += ` (limitado pela variação máxima de ${data.safeguards?.maxChangePercent}%)`;
      }

      results.push({
        sku: product.sku,
        productName: product.produto,
        marketplace: 'magalu',
        currentPrice,
        suggestedPrice: Math.round(suggestedPrice * 100) / 100,
        changePercent: ((suggestedPrice - currentPrice) / currentPrice) * 100,
        reason,
        status,
      });
    });

    const summary: SimulationSummary = {
      totalAnalyzed: results.length,
      willChange: results.filter(r => r.status === 'will_change').length,
      noChange: results.filter(r => r.status === 'no_change').length,
      blocked: results.filter(r => r.status === 'blocked').length,
      results,
    };

    setSimulationResults(summary);
    setCurrentSimulation(summary);
    setIsSimulating(false);
  };

  const ReviewSection = ({ 
    title, 
    step, 
    children 
  }: { 
    title: string; 
    step: number; 
    children: React.ReactNode 
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => onEdit(step)} className="gap-1">
          <Pencil className="w-3 h-3" />
          Editar
        </Button>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <ReviewSection title="Informações Básicas" step={1}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Nome:</dt>
              <dd className="font-medium">{data.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Prioridade:</dt>
              <dd className="font-medium">{data.priority}</dd>
            </div>
          </dl>
        </ReviewSection>

        <ReviewSection title="Seleção de SKUs" step={2}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tipo:</dt>
              <dd className="font-medium">
                {data.skuSelection?.type === 'manual' ? 'Lista Manual' : 'Por Filtros'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">SKUs afetados:</dt>
              <dd className="font-medium text-primary">{getMatchingProducts().length}</dd>
            </div>
          </dl>
        </ReviewSection>

        <ReviewSection title="Tipo de Regra" step={3}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Regra:</dt>
              <dd>
                <Badge>{RULE_TYPE_LABELS[data.ruleType || 'competitor_based']}</Badge>
              </dd>
            </div>
          </dl>
        </ReviewSection>

        <ReviewSection title="Limites de Segurança" step={4}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Margem mínima:</dt>
              <dd className="font-medium">{data.safeguards?.minMargin}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Desconto máximo:</dt>
              <dd className="font-medium">{data.safeguards?.maxDiscount}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Variação máxima:</dt>
              <dd className="font-medium">{data.safeguards?.maxChangePercent}%</dd>
            </div>
          </dl>
        </ReviewSection>
      </div>

      <ReviewSection title="Agendamento" step={5}>
        <div className="text-sm">
          <Badge variant="outline">{SCHEDULE_LABELS[data.schedule?.frequency || 'daily']}</Badge>
          {data.schedule?.specificTime && (
            <span className="ml-2 text-muted-foreground">às {data.schedule.specificTime}</span>
          )}
        </div>
      </ReviewSection>

      {/* Simulation */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Simulação
          </CardTitle>
          <CardDescription>
            Execute uma simulação para ver o impacto da regra antes de ativá-la
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!simulationResults ? (
            <Button onClick={runSimulation} disabled={isSimulating} className="gap-2">
              {isSimulating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Simulando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Executar Simulação
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-3">
                <Card>
                  <CardContent className="pt-3 text-center">
                    <div className="text-xl font-bold">{simulationResults.totalAnalyzed}</div>
                    <div className="text-xs text-muted-foreground">Analisados</div>
                  </CardContent>
                </Card>
                <Card className="border-green-500/30">
                  <CardContent className="pt-3 text-center">
                    <div className="text-xl font-bold text-green-500">{simulationResults.willChange}</div>
                    <div className="text-xs text-muted-foreground">Alterações</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-3 text-center">
                    <div className="text-xl font-bold text-muted-foreground">{simulationResults.noChange}</div>
                    <div className="text-xs text-muted-foreground">Sem mudança</div>
                  </CardContent>
                </Card>
                <Card className="border-red-500/30">
                  <CardContent className="pt-3 text-center">
                    <div className="text-xl font-bold text-red-500">{simulationResults.blocked}</div>
                    <div className="text-xs text-muted-foreground">Bloqueados</div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Table */}
              <ScrollArea className="h-[250px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Atual</TableHead>
                      <TableHead className="text-right">Sugerido</TableHead>
                      <TableHead className="text-right">Δ</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulationResults.results.map((result, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{result.sku}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{result.productName}</TableCell>
                        <TableCell className="text-right">R$ {result.currentPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          R$ {result.suggestedPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className={`text-right ${
                          result.changePercent < 0 ? 'text-red-500' : 
                          result.changePercent > 0 ? 'text-green-500' : ''
                        }`}>
                          {result.changePercent !== 0 ? (result.changePercent > 0 ? '+' : '') + result.changePercent.toFixed(1) + '%' : '-'}
                        </TableCell>
                        <TableCell>
                          {result.status === 'will_change' && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Alterará
                            </Badge>
                          )}
                          {result.status === 'no_change' && (
                            <Badge variant="outline" className="text-muted-foreground">
                              Sem mudança
                            </Badge>
                          )}
                          {result.status === 'blocked' && (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                              <XCircle className="w-3 h-3 mr-1" />
                              Bloqueado
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              <Button variant="outline" onClick={runSimulation} size="sm">
                Simular Novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
