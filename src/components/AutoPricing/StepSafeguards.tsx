import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingRule, Safeguards } from '@/types/autoPricing';

interface StepSafeguardsProps {
  data: Partial<PricingRule>;
  onChange: (updates: Partial<PricingRule>) => void;
}

export const StepSafeguards: React.FC<StepSafeguardsProps> = ({ data, onChange }) => {
  const safeguards = data.safeguards || {
    minMargin: 10,
    maxDiscount: 15,
    maxChangePercent: 5,
  };

  const updateSafeguards = (updates: Partial<Safeguards>) => {
    onChange({ safeguards: { ...safeguards, ...updates } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <Shield className="w-6 h-6 text-yellow-500" />
        <div>
          <div className="font-medium text-foreground">Proteções de Segurança</div>
          <div className="text-sm text-muted-foreground">
            Estes limites garantem que os preços nunca serão alterados de forma prejudicial ao negócio
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Margem Mínima */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Margem Mínima
            </CardTitle>
            <CardDescription>
              O preço nunca ficará abaixo de custo + margem mínima
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Margem Mínima (%)</Label>
              <Input
                type="number"
                value={safeguards.minMargin}
                onChange={(e) => updateSafeguards({ minMargin: Number(e.target.value) })}
                min={0}
                max={100}
              />
              <p className="text-xs text-muted-foreground">
                Ex: Se custo = R$100 e margem mínima = 10%, preço mínimo = R$110
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Desconto Máximo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Desconto Máximo
            </CardTitle>
            <CardDescription>
              Limite máximo de desconto em relação ao preço atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Desconto Máximo (%)</Label>
              <Input
                type="number"
                value={safeguards.maxDiscount}
                onChange={(e) => updateSafeguards({ maxDiscount: Number(e.target.value) })}
                min={0}
                max={50}
              />
              <p className="text-xs text-muted-foreground">
                Ex: Se preço atual = R$100 e max desconto = 15%, mínimo = R$85
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Variação Máxima por Execução */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-500" />
              Variação Máxima por Execução
            </CardTitle>
            <CardDescription>
              Limite de alteração de preço por execução da regra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Variação Máxima (%)</Label>
              <Input
                type="number"
                value={safeguards.maxChangePercent}
                onChange={(e) => updateSafeguards({ maxChangePercent: Number(e.target.value) })}
                min={0}
                max={30}
              />
              <p className="text-xs text-muted-foreground">
                Evita alterações bruscas, permitindo ajustes graduais
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preço Mínimo Absoluto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preço Mínimo Absoluto (Opcional)</CardTitle>
            <CardDescription>
              Valor fixo abaixo do qual nenhum preço pode ir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Preço Mínimo (R$)</Label>
              <Input
                type="number"
                value={safeguards.minPrice || ''}
                onChange={(e) => updateSafeguards({ 
                  minPrice: e.target.value ? Number(e.target.value) : undefined 
                })}
                min={0}
                placeholder="Deixe vazio para não aplicar"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preço Máximo Absoluto */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Preço Máximo Absoluto (Opcional)</CardTitle>
            <CardDescription>
              Valor fixo acima do qual nenhum preço pode ir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-w-md">
              <Label>Preço Máximo (R$)</Label>
              <Input
                type="number"
                value={safeguards.maxPrice || ''}
                onChange={(e) => updateSafeguards({ 
                  maxPrice: e.target.value ? Number(e.target.value) : undefined 
                })}
                min={0}
                placeholder="Deixe vazio para não aplicar"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <div className="text-sm">
            <strong>Resumo das proteções:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Margem nunca ficará abaixo de <strong className="text-foreground">{safeguards.minMargin}%</strong></li>
              <li>Desconto máximo de <strong className="text-foreground">{safeguards.maxDiscount}%</strong> em relação ao preço atual</li>
              <li>Variação máxima de <strong className="text-foreground">{safeguards.maxChangePercent}%</strong> por execução</li>
              {safeguards.minPrice && (
                <li>Preço nunca ficará abaixo de <strong className="text-foreground">R$ {safeguards.minPrice.toFixed(2)}</strong></li>
              )}
              {safeguards.maxPrice && (
                <li>Preço nunca ficará acima de <strong className="text-foreground">R$ {safeguards.maxPrice.toFixed(2)}</strong></li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
