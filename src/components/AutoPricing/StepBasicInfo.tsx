import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { PricingRule } from '@/types/autoPricing';

interface StepBasicInfoProps {
  data: Partial<PricingRule>;
  onChange: (updates: Partial<PricingRule>) => void;
}

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Regra *</Label>
        <Input
          id="name"
          placeholder="Ex: Competir com menor preço - Michelin"
          value={data.name || ''}
          onChange={(e) => onChange({ name: e.target.value })}
          className="text-lg"
        />
        <p className="text-sm text-muted-foreground">
          Escolha um nome descritivo que identifique facilmente esta regra
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descreva o objetivo desta regra e quando ela deve ser aplicada..."
          value={data.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Prioridade</Label>
          <span className="text-lg font-semibold text-primary">{data.priority || 50}</span>
        </div>
        <Slider
          value={[data.priority || 50]}
          onValueChange={([value]) => onChange({ priority: value })}
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Baixa (1)</span>
          <span>Média (50)</span>
          <span>Alta (100)</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Regras com maior prioridade são executadas primeiro em caso de conflito
        </p>
      </div>
    </div>
  );
};
