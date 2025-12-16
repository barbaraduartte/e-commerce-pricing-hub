import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, Download, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAutoPricing } from '@/contexts/AutoPricingContext';
import { CompetitorPrice, MARKETPLACE_LABELS, Marketplace } from '@/types/autoPricing';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const CompetitorImport: React.FC = () => {
  const { competitorPrices, importCompetitorPrices, clearCompetitorPrices } = useAutoPricing();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Simulação de processamento - em produção, usaria uma lib como papaparse ou xlsx
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dados de exemplo para demonstração
      const sampleData: CompetitorPrice[] = [
        {
          id: crypto.randomUUID(),
          sku: '57163',
          competitorName: 'Loja ABC',
          competitorPrice: 458.00,
          marketplace: 'mercadolivre_classico',
          capturedAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          sku: '57163',
          competitorName: 'Pneus XYZ',
          competitorPrice: 462.00,
          marketplace: 'mercadolivre_classico',
          capturedAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          sku: '22263',
          competitorName: 'Loja ABC',
          competitorPrice: 1260.00,
          marketplace: 'mercadolivre_premium',
          capturedAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          sku: '22263',
          competitorName: 'Auto Peças BR',
          competitorPrice: 1275.00,
          marketplace: 'magalu',
          capturedAt: new Date().toISOString(),
        },
      ];
      
      importCompetitorPrices(sampleData);
      toast.success(`${sampleData.length} preços importados com sucesso!`);
    } catch (error) {
      toast.error('Erro ao processar arquivo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        processFile(file);
      } else {
        toast.error('Formato de arquivo não suportado. Use CSV ou XLSX.');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const downloadTemplate = () => {
    const template = `sku,competitor_name,competitor_price,marketplace,captured_at
57163,Loja Exemplo,450.00,mercadolivre_classico,2024-06-18 10:00
22263,Outra Loja,1250.00,mercadolivre_premium,2024-06-18 10:00`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_precos_concorrentes.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Modelo baixado com sucesso');
  };

  const handleClearAll = () => {
    clearCompetitorPrices();
    toast.success('Todos os preços foram removidos');
  };

  // Agrupa preços por SKU para exibição
  const groupedPrices = competitorPrices.reduce((acc, price) => {
    if (!acc[price.sku]) {
      acc[price.sku] = [];
    }
    acc[price.sku].push(price);
    return acc;
  }, {} as Record<string, CompetitorPrice[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Upload className="w-6 h-6 text-primary" />
          Importar Preços de Concorrentes
        </h1>
        <p className="text-muted-foreground mt-1">
          Importe planilhas com preços dos concorrentes para usar nas regras de precificação
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Arquivo</CardTitle>
          <CardDescription>
            Arraste uma planilha CSV ou XLSX com os preços dos concorrentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Processando arquivo...</p>
              </div>
            ) : (
              <>
                <FileSpreadsheet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  Arraste seu arquivo aqui
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  ou clique para selecionar
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Selecionar Arquivo</span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-4">
                  Formatos aceitos: CSV, XLSX
                </p>
              </>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="link" onClick={downloadTemplate} className="gap-2">
              <Download className="w-4 h-4" />
              Baixar modelo de planilha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expected Format */}
      <Card>
        <CardHeader>
          <CardTitle>Formato Esperado</CardTitle>
          <CardDescription>
            Sua planilha deve conter as seguintes colunas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coluna</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Exemplo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono">sku</TableCell>
                <TableCell>Código do produto</TableCell>
                <TableCell className="font-mono">57163</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">competitor_name</TableCell>
                <TableCell>Nome do concorrente</TableCell>
                <TableCell className="font-mono">Loja ABC</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">competitor_price</TableCell>
                <TableCell>Preço do concorrente</TableCell>
                <TableCell className="font-mono">458.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">marketplace</TableCell>
                <TableCell>
                  Marketplace (mercadolivre_classico, mercadolivre_premium, magalu, amazon, shopee)
                </TableCell>
                <TableCell className="font-mono">mercadolivre_classico</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">captured_at</TableCell>
                <TableCell>Data/hora da captura (opcional)</TableCell>
                <TableCell className="font-mono">2024-06-18 10:00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Imported Data */}
      {competitorPrices.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Preços Importados
              </CardTitle>
              <CardDescription>
                {competitorPrices.length} preços de {Object.keys(groupedPrices).length} SKUs
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleClearAll} className="gap-2 text-destructive">
              <Trash2 className="w-4 h-4" />
              Limpar Tudo
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Concorrente</TableHead>
                  <TableHead>Marketplace</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead>Capturado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitorPrices.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell className="font-mono">{price.sku}</TableCell>
                    <TableCell>{price.competitorName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {MARKETPLACE_LABELS[price.marketplace]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {price.competitorPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(price.capturedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
