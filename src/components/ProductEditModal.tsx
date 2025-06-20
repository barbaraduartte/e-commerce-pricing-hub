
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { Product } from '../contexts/ProductContext';
import { useProducts } from '../contexts/ProductContext';
import { useToast } from '@/hooks/use-toast';

interface ProductEditModalProps {
  product: Product;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({ product }) => {
  const { updateProduct } = useProducts();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    produto: product.produto,
    estoque: product.estoque.toString(),
    custo: product.custo.toString(),
    marca: product.marca,
  });

  const handleSave = () => {
    const updatedProduct = {
      produto: formData.produto,
      estoque: parseInt(formData.estoque) || 0,
      custo: parseFloat(formData.custo) || 0,
      marca: formData.marca,
    };

    updateProduct(product.sku, updatedProduct);
    
    toast({
      title: "Produto atualizado!",
      description: `O produto ${formData.produto} foi atualizado com sucesso.`,
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-blue-100 text-blue-600"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-blue-800">Editar Produto</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right text-blue-700">
              SKU
            </Label>
            <Input
              id="sku"
              value={product.sku}
              disabled
              className="col-span-3 bg-gray-100"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="produto" className="text-right text-blue-700">
              Produto
            </Label>
            <Input
              id="produto"
              value={formData.produto}
              onChange={(e) => setFormData(prev => ({ ...prev, produto: e.target.value }))}
              className="col-span-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estoque" className="text-right text-blue-700">
              Estoque
            </Label>
            <Input
              id="estoque"
              type="number"
              value={formData.estoque}
              onChange={(e) => setFormData(prev => ({ ...prev, estoque: e.target.value }))}
              className="col-span-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="custo" className="text-right text-blue-700">
              Custo
            </Label>
            <Input
              id="custo"
              type="number"
              step="0.01"
              value={formData.custo}
              onChange={(e) => setFormData(prev => ({ ...prev, custo: e.target.value }))}
              className="col-span-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="marca" className="text-right text-blue-700">
              Marca
            </Label>
            <Input
              id="marca"
              value={formData.marca}
              onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
              className="col-span-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
