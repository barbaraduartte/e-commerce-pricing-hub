import React, { useState } from 'react';
import { History, CheckCircle, AlertTriangle, XCircle, Eye, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAutoPricing } from '@/contexts/AutoPricingContext';
import { ExecutionLog, MARKETPLACE_LABELS } from '@/types/autoPricing';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const ExecutionHistory: React.FC = () => {
  const { executionLogs } = useAutoPricing();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredLogs = executionLogs.filter(log =>
    log.ruleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: ExecutionLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusLabel = (status: ExecutionLog['status']) => {
    switch (status) {
      case 'success':
        return 'Sucesso';
      case 'partial':
        return 'Parcial';
      case 'failed':
        return 'Falhou';
    }
  };

  const getStatusColor = (status: ExecutionLog['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const handleViewDetails = (log: ExecutionLog) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  const handleRollback = (log: ExecutionLog) => {
    toast.info('Funcionalidade de rollback será implementada na próxima fase');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <History className="w-6 h-6 text-primary" />
          Histórico de Execuções
        </h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe todas as execuções das regras de precificação
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome da regra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Execuções Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center">
              <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma execução encontrada
              </h3>
              <p className="text-muted-foreground">
                As execuções das regras aparecerão aqui
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Regra</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Analisados</TableHead>
                  <TableHead className="text-center">Alterados</TableHead>
                  <TableHead className="text-center">Erros</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {format(new Date(log.executedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{log.ruleName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge variant="outline" className={getStatusColor(log.status)}>
                          {getStatusLabel(log.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {log.summary.totalSkusAnalyzed}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-green-500 font-medium">
                        {log.summary.pricesChanged}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {log.summary.errors > 0 ? (
                        <span className="text-red-500 font-medium">
                          {log.summary.errors}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Detalhes
                        </Button>
                        {log.changes.some(c => c.canRollback) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRollback(log)}
                            className="gap-1"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Rollback
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Detalhes da Execução</DialogTitle>
            <DialogDescription>
              {selectedLog && (
                <>
                  {selectedLog.ruleName} - {format(new Date(selectedLog.executedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {selectedLog.summary.totalSkusAnalyzed}
                      </div>
                      <div className="text-sm text-muted-foreground">Analisados</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {selectedLog.summary.pricesChanged}
                      </div>
                      <div className="text-sm text-muted-foreground">Alterados</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-muted-foreground">
                        {selectedLog.summary.pricesUnchanged}
                      </div>
                      <div className="text-sm text-muted-foreground">Sem mudança</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold text-red-500">
                        {selectedLog.summary.errors}
                      </div>
                      <div className="text-sm text-muted-foreground">Erros</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Changes Table */}
                {selectedLog.changes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Alterações de Preço</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Produto</TableHead>
                          <TableHead>Marketplace</TableHead>
                          <TableHead className="text-right">Anterior</TableHead>
                          <TableHead className="text-right">Novo</TableHead>
                          <TableHead className="text-right">Variação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedLog.changes.map((change, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono">{change.sku}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {change.productName}
                            </TableCell>
                            <TableCell>
                              {MARKETPLACE_LABELS[change.marketplace]}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {change.previousPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              R$ {change.newPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className={`text-right font-medium ${
                              change.changePercent < 0 ? 'text-red-500' : 'text-green-500'
                            }`}>
                              {change.changePercent > 0 ? '+' : ''}{change.changePercent.toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Errors */}
                {selectedLog.errors && selectedLog.errors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-red-500">Erros</h4>
                    <div className="space-y-2">
                      {selectedLog.errors.map((error, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                        >
                          <div className="font-mono text-sm">SKU: {error.sku}</div>
                          <div className="text-sm text-muted-foreground">{error.error}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
