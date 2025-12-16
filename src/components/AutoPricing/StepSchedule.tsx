import React from 'react';
import { Clock, Zap, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { PricingRule, Schedule, ScheduleFrequency, SCHEDULE_LABELS } from '@/types/autoPricing';
import { cn } from '@/lib/utils';

interface StepScheduleProps {
  data: Partial<PricingRule>;
  onChange: (updates: Partial<PricingRule>) => void;
}

const WEEKDAYS = [
  { id: 0, label: 'Dom' },
  { id: 1, label: 'Seg' },
  { id: 2, label: 'Ter' },
  { id: 3, label: 'Qua' },
  { id: 4, label: 'Qui' },
  { id: 5, label: 'Sex' },
  { id: 6, label: 'Sáb' },
];

const frequencyIcons: Record<ScheduleFrequency, React.ReactNode> = {
  realtime: <Zap className="w-5 h-5" />,
  hourly: <Clock className="w-5 h-5" />,
  daily: <Calendar className="w-5 h-5" />,
  weekly: <Calendar className="w-5 h-5" />,
};

const frequencyDescriptions: Record<ScheduleFrequency, string> = {
  realtime: 'Executa sempre que houver novos dados de concorrentes',
  hourly: 'Executa a cada hora, automaticamente',
  daily: 'Executa uma vez por dia no horário especificado',
  weekly: 'Executa nos dias da semana selecionados',
};

export const StepSchedule: React.FC<StepScheduleProps> = ({ data, onChange }) => {
  const schedule = data.schedule || { frequency: 'daily' };

  const updateSchedule = (updates: Partial<Schedule>) => {
    onChange({ schedule: { ...schedule, ...updates } });
  };

  const toggleWeekday = (dayId: number) => {
    const currentDays = schedule.weekDays || [];
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter(d => d !== dayId)
      : [...currentDays, dayId].sort();
    updateSchedule({ weekDays: newDays });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Frequência de Execução</Label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(['realtime', 'hourly', 'daily', 'weekly'] as ScheduleFrequency[]).map(freq => (
            <Card
              key={freq}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                schedule.frequency === freq && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => updateSchedule({ frequency: freq })}
            >
              <CardContent className="pt-4 text-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2",
                  schedule.frequency === freq ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {frequencyIcons[freq]}
                </div>
                <div className="font-medium text-sm">{SCHEDULE_LABELS[freq]}</div>
                <div className="text-xs text-muted-foreground mt-1">{frequencyDescriptions[freq]}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Time Selection for Daily */}
      {schedule.frequency === 'daily' && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2 max-w-xs">
              <Label>Horário de Execução</Label>
              <Input
                type="time"
                value={schedule.specificTime || '06:00'}
                onChange={(e) => updateSchedule({ specificTime: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                A regra será executada todos os dias neste horário
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day and Time Selection for Weekly */}
      {schedule.frequency === 'weekly' && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              <Label>Dias da Semana</Label>
              <div className="flex gap-2">
                {WEEKDAYS.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleWeekday(day.id)}
                    className={cn(
                      "w-12 h-12 rounded-full font-medium transition-colors",
                      schedule.weekDays?.includes(day.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-w-xs">
              <Label>Horário de Execução</Label>
              <Input
                type="time"
                value={schedule.specificTime || '06:00'}
                onChange={(e) => updateSchedule({ specificTime: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-foreground">Execução Automática</div>
                <div className="text-sm text-muted-foreground">
                  A regra será executada automaticamente conforme o agendamento configurado
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium text-foreground">Execução Manual</div>
                <div className="text-sm text-muted-foreground">
                  Você também pode executar a regra manualmente a qualquer momento
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <div className="text-sm">
            <strong>Resumo do agendamento:</strong>
            <p className="mt-2 text-muted-foreground">
              {schedule.frequency === 'realtime' && 'A regra será executada em tempo real sempre que houver novos dados de concorrentes.'}
              {schedule.frequency === 'hourly' && 'A regra será executada automaticamente a cada hora.'}
              {schedule.frequency === 'daily' && `A regra será executada todos os dias às ${schedule.specificTime || '06:00'}.`}
              {schedule.frequency === 'weekly' && (
                <>
                  A regra será executada às {schedule.specificTime || '06:00'} nos seguintes dias:{' '}
                  <strong className="text-foreground">
                    {(schedule.weekDays || [])
                      .map(d => WEEKDAYS.find(w => w.id === d)?.label)
                      .join(', ') || 'Nenhum dia selecionado'}
                  </strong>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
