
import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-orange-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar pneus, SKUs, marcas..."
              className="pl-10 w-80 focus:ring-orange-500 focus:border-orange-500 border-orange-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-orange-100 text-orange-600">
            <Bell className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-orange-100 text-orange-600">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-orange-200">
              <DropdownMenuItem className="hover:bg-orange-50">Perfil</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-orange-50">Configurações</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-orange-50">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
