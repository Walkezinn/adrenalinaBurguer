'use client';
import { useCart } from '@/contexts/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col">
      <img className="w-full h-48 object-cover" src={product.image_url || 'https://via.placeholder.com/400x300'} alt={product.name} />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white">{product.name}</h3>
        <p className="text-gray-400 mt-2 text-sm flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-2xl font-black text-white">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="bg-brand text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-brand-dark"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}