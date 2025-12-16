import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAutoPricing } from '@/contexts/AutoPricingContext';
import { PricingRule, RuleType } from '@/types/autoPricing';
import { StepBasicInfo } from '@/components/AutoPricing/StepBasicInfo';
import { StepSkuSelection } from '@/components/AutoPricing/StepSkuSelection';
import { StepRuleConfig } from '@/components/AutoPricing/StepRuleConfig';
import { StepSafeguards } from '@/components/AutoPricing/StepSafeguards';
import { StepSchedule } from '@/components/AutoPricing/StepSchedule';
import { StepReview } from '@/components/AutoPricing/StepReview';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Informações Básicas', description: 'Nome e descrição da regra' },
  { id: 2, title: 'Seleção de SKUs', description: 'Quais produtos serão afetados' },
  { id: 3, title: 'Tipo de Regra', description: 'Configure a lógica de precificação' },
  { id: 4, title: 'Limites de Segurança', description: 'Proteções contra alterações indesejadas' },
  { id: 5, title: 'Agendamento', description: 'Quando a regra será executada' },
  { id: 6, title: 'Revisão', description: 'Confirme e ative a regra' },
];

const getDefaultRule = (): Partial<PricingRule> => ({
  name: '',
  description: '',
  status: 'draft',
  priority: 50,
  skuSelection: {
    type: 'filter',
    filters: {},
  },
  ruleType: 'competitor_based',
  ruleParameters: {},
  safeguards: {
    minMargin: 10,
    maxDiscount: 15,
    maxChangePercent: 5,
  },
  schedule: {
    frequency: 'daily',
  },
});

export const RuleEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { rules, addRule, updateRule } = useAutoPricing();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [ruleData, setRuleData] = useState<Partial<PricingRule>>(getDefaultRule());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const existingRule = rules.find(r => r.id === id);
      if (existingRule) {
        setRuleData(existingRule);
        setIsEditing(true);
      }
    }
  }, [id, rules]);

  const updateRuleData = (updates: Partial<PricingRule>) => {
    setRuleData(prev => ({ ...prev, ...updates }));
  };

  const progress = (currentStep / STEPS.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return ruleData.name && ruleData.name.length >= 3;
      case 2:
        return ruleData.skuSelection?.type === 'manual' 
          ? (ruleData.skuSelection.manualSkus?.length || 0) > 0
          : Object.keys(ruleData.skuSelection?.filters || {}).length > 0;
      case 3:
        return ruleData.ruleType && Object.keys(ruleData.ruleParameters || {}).length > 0;
      case 4:
        return ruleData.safeguards?.minMargin !== undefined;
      case 5:
        return ruleData.schedule?.frequency;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = (activate: boolean) => {
    const now = new Date().toISOString();
    const finalRule: PricingRule = {
      ...ruleData as PricingRule,
      id: id || crypto.randomUUID(),
      status: activate ? 'active' : 'draft',
      createdAt: isEditing ? ruleData.createdAt! : now,
      updatedAt: now,
      createdBy: 'admin',
    };

    if (isEditing) {
      updateRule(finalRule.id, finalRule);
      toast.success('Regra atualizada com sucesso!');
    } else {
      addRule(finalRule);
      toast.success(activate ? 'Regra criada e ativada!' : 'Regra salva como rascunho');
    }

    navigate('/precificacao-inteligente/regras');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo data={ruleData} onChange={updateRuleData} />;
      case 2:
        return <StepSkuSelection data={ruleData} onChange={updateRuleData} />;
      case 3:
        return <StepRuleConfig data={ruleData} onChange={updateRuleData} />;
      case 4:
        return <StepSafeguards data={ruleData} onChange={updateRuleData} />;
      case 5:
        return <StepSchedule data={ruleData} onChange={updateRuleData} />;
      case 6:
        return <StepReview data={ruleData} onEdit={setCurrentStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/precificacao-inteligente/regras')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            {isEditing ? 'Editar Regra' : 'Nova Regra de Precificação'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {STEPS[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step.id < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step.id === currentStep
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      step.id < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map(step => (
              <span key={step.id} className="text-center max-w-[100px]">
                {step.title}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="min-h-[400px]">
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {currentStep === STEPS.length ? (
            <>
              <Button variant="outline" onClick={() => handleSave(false)}>
                Salvar Rascunho
              </Button>
              <Button onClick={() => handleSave(true)} className="gap-2">
                <Check className="w-4 h-4" />
                Ativar Regra
              </Button>
            </>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
              Próximo
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
