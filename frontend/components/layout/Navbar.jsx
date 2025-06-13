'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, LogOut, UserCircle, Gauge, UtensilsCross, Truck } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-brand/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black text-white hover:text-brand transition-colors">
          ADRENALINA <span className="text-brand">BURGUER</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/menu" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <UtensilsCross size={16}/> Cardápio
          </Link>

          {isAuthenticated ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin/orders" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Gauge size={16}/> Painel Admin
                </Link>
              )}
              {user.role === 'entregador' && (
                <Link href="/delivery/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                   <Truck size={16}/> Painel Entregador
                </Link>
              )}
              <span className="text-gray-500">|</span>
              <div className="text-white flex items-center gap-2"><UserCircle/> {user.name.split(' ')[0]}</div>
              <button onClick={logout} className="text-gray-300 hover:text-brand transition-colors flex items-center gap-2">
                <LogOut size={16}/> Sair
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
          )}

          <Link href="/cart" className="relative text-white hover:text-brand transition-colors p-2">
            <ShoppingCart />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-brand text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}