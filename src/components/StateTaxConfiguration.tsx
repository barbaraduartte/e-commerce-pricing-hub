
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
  
  const [editingTaxes, setEditingTaxes] = useState({
    icms: '',
    ipi: '',
    pis: '',
    cofins: '',
  });

  const currentStateTax = getCurrentStateTaxes();

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const stateTax = stateTaxes.find(tax => tax.state === state);
    if (stateTax) {
      setEditingTaxes({
        icms: stateTax.icms.toString(),
        ipi: stateTax.ipi.toString(),
        pis: stateTax.pis.toString(),
        cofins: stateTax.cofins.toString(),
      });
    }
  };

  const saveTaxes = () => {
    if (currentStateTax) {
      const newTaxes = {
        icms: parseFloat(editingTaxes.icms) || 0,
        ipi: parseFloat(editingTaxes.ipi) || 0,
        pis: parseFloat(editingTaxes.pis) || 0,
        cofins: parseFloat(editingTaxes.cofins) || 0,
      };
      updateStateTax(selectedState, newTaxes);
      toast({
        title: "Impostos atualizados!",
        description: `Impostos para ${currentStateTax.stateName} foram salvos com sucesso.`,
        className: "bg-orange-50 border-orange-200 text-orange-800",
      });
    }
  };

  const getTotalTaxes = () => {
    if (!currentStateTax) return 0;
    return currentStateTax.icms + currentStateTax.ipi + currentStateTax.pis + currentStateTax.cofins;
  };

  React.useEffect(() => {
    if (currentStateTax) {
      setEditingTaxes({
        icms: currentStateTax.icms.toString(),
        ipi: currentStateTax.ipi.toString(),
        pis: currentStateTax.pis.toString(),
        cofins: currentStateTax.cofins.toString(),
      });
    }
  }, [currentStateTax]);

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Impostos por Estado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Estado</label>
          <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
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
              <Badge className="bg-orange-100 text-orange-800">
                {currentStateTax.stateName}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">ICMS (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingTaxes.icms}
                  onChange={(e) => setEditingTaxes(prev => ({ ...prev, icms: e.target.value }))}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">IPI (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingTaxes.ipi}
                  onChange={(e) => setEditingTaxes(prev => ({ ...prev, ipi: e.target.value }))}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">PIS (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingTaxes.pis}
                  onChange={(e) => setEditingTaxes(prev => ({ ...prev, pis: e.target.value }))}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">COFINS (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingTaxes.cofins}
                  onChange={(e) => setEditingTaxes(prev => ({ ...prev, cofins: e.target.value }))}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-orange-800">
                Total de Impostos ({currentStateTax.stateName}): {getTotalTaxes().toFixed(2)}%
              </div>
            </div>

            <Button 
              onClick={saveTaxes}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Impostos para {currentStateTax.stateName}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
