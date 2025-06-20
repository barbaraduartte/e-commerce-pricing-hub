
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Save } from 'lucide-react';
import { useShipping } from '../contexts/ShippingContext';
import { useToast } from '@/hooks/use-toast';

export const StateTaxConfiguration: React.FC = () => {
  const { stateTaxes, selectedState, setSelectedState, updateStateTax, getCurrentStateTaxes } = useShipping();
  const { toast } = useToast();
  
  const [editingTax, setEditingTax] = useState('');

  const currentStateTax = getCurrentStateTaxes();

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const stateTax = stateTaxes.find(tax => tax.state === state);
    if (stateTax) {
      setEditingTax(stateTax.taxPercentage.toString());
    }
  };

  const saveTax = () => {
    if (currentStateTax) {
      const newTaxPercentage = parseFloat(editingTax) || 0;
      updateStateTax(selectedState, newTaxPercentage);
      toast({
        title: "Imposto atualizado!",
        description: `Imposto para ${currentStateTax.stateName} foi salvo com sucesso.`,
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
    }
  };

  React.useEffect(() => {
    if (currentStateTax) {
      setEditingTax(currentStateTax.taxPercentage.toString());
    }
  }, [currentStateTax]);

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Impostos por Estado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Estado</label>
          <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {stateTaxes.map((state) => (
                <SelectItem key={state.state} value={state.state}>
                  {state.state} - {state.stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentStateTax && (
          <>
            <div className="flex items-center space-x-2 mb-4">
              <Badge className="bg-blue-100 text-blue-800">
                {currentStateTax.stateName}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Imposto Total (%)</label>
              <Input
                type="number"
                step="0.01"
                value={editingTax}
                onChange={(e) => setEditingTax(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                Imposto para {currentStateTax.stateName}: {currentStateTax.taxPercentage.toFixed(2)}%
              </div>
            </div>

            <Button 
              onClick={saveTax}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Imposto para {currentStateTax.stateName}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
