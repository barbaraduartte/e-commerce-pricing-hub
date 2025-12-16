import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Play, Pause, Pencil, History, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAutoPricing } from '@/contexts/AutoPricingContext';
import { 
  RULE_TYPE_LABELS, 
  SCHEDULE_LABELS, 
  STATUS_LABELS,
  RuleStatus 
} from '@/types/autoPricing';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const RulesList: React.FC = () => {
  const navigate = useNavigate();
  const { rules, toggleRuleStatus, deleteRule } = useAutoPricing();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RuleStatus | 'all'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: RuleStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleToggleStatus = (id: string, currentStatus: RuleStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    toggleRuleStatus(id, newStatus);
    toast.success(`Regra ${newStatus === 'active' ? 'ativada' : 'pausada'} com sucesso`);
  };

  const handleDeleteConfirm = () => {
    if (ruleToDelete) {
      deleteRule(ruleToDelete);
      toast.success('Regra excluída com sucesso');
      setRuleToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const getSkuCount = (rule: typeof rules[0]) => {
    if (rule.skuSelection.type === 'manual') {
      return rule.skuSelection.manualSkus?.length || 0;
    }
    // Para filtros, seria calculado dinamicamente com base nos produtos
    return '~';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Regras de Precificação
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas regras de precificação automática
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/precificacao-inteligente/regras/nova')}>
          <Plus className="w-4 h-4" />
          Nova Regra
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar regras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {statusFilter === 'all' ? 'Todos os status' : STATUS_LABELS[statusFilter]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  Todos os status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Ativas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                  Pausadas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                  Rascunhos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Zap className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma regra encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie sua primeira regra de precificação automática'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="gap-2" onClick={() => navigate('/precificacao-inteligente/regras/nova')}>
                  <Plus className="w-4 h-4" />
                  Criar Primeira Regra
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredRules.map((rule) => (
            <Card key={rule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Rule Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        rule.status === 'active' ? 'bg-green-500' : 
                        rule.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {rule.name}
                      </h3>
                      <Badge variant="outline" className={getStatusColor(rule.status)}>
                        {STATUS_LABELS[rule.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {rule.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Badge variant="secondary" className="font-normal">
                          {RULE_TYPE_LABELS[rule.ruleType]}
                        </Badge>
                      </span>
                      <span>{getSkuCount(rule)} SKUs</span>
                      <span>Executa: {SCHEDULE_LABELS[rule.schedule.frequency]}</span>
                      {rule.lastExecutedAt && (
                        <span>
                          Última execução: {formatDistanceToNow(new Date(rule.lastExecutedAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(rule.id, rule.status)}
                      className="gap-1"
                    >
                      {rule.status === 'active' ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate(`/precificacao-inteligente/regras/${rule.id}/editar`)}>
                      <Pencil className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <History className="w-4 h-4" />
                      Histórico
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setRuleToDelete(rule.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir regra?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A regra será permanentemente excluída
              e não poderá ser recuperada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
