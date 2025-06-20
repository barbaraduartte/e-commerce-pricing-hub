
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  sku: string;
  produto: string;
  estoque: number;
  custo: number;
  marca: string;
  precoMagalu: number;
  margemMagalu: number;
  precoMLClassico: number;
  margemMLClassico: number;
  precoMLPremium: number;
  margemMLPremium: number;
  ultimaAlteracao: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (sku: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (sku: string) => void;
  getAllBrands: () => string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const sampleProducts: Product[] = [
  {
    sku: '57163',
    produto: 'Pneu 235/45R19 99W Sunset Ventura HP B1',
    estoque: 12,
    custo: 380.00,
    marca: 'B1',
    precoMagalu: 465.00,
    margemMagalu: 18.2,
    precoMLClassico: 450.00,
    margemMLClassico: 15.8,
    precoMLPremium: 480.00,
    margemMLPremium: 20.1,
    ultimaAlteracao: '2024-06-18',
  },
  {
    sku: '22263',
    produto: '255/35R20 PILOT SPORT 4S EXTRA LOAD 97Y MICHELIN',
    estoque: 7,
    custo: 1050.00,
    marca: 'MICHELIN',
    precoMagalu: 1280.00,
    margemMagalu: 18.0,
    precoMLClassico: 1250.00,
    margemMLClassico: 16.0,
    precoMLPremium: 1320.00,
    margemMLPremium: 20.5,
    ultimaAlteracao: '2024-06-18',
  },
];

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (sku: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.sku === sku 
          ? { ...product, ...updatedProduct, ultimaAlteracao: new Date().toISOString().split('T')[0] }
          : product
      )
    );
  };

  const deleteProduct = (sku: string) => {
    setProducts(prev => prev.filter(product => product.sku !== sku));
  };

  const getAllBrands = () => {
    const brands = [...new Set(products.map(product => product.marca))].sort();
    return brands;
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getAllBrands }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
