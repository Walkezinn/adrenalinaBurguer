import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter">
            Adrenalina
            <span className="block text-brand">Burguer</span>
        </h1>
        <p className="text-gray-300 mt-4 max-w-2xl text-lg">
            Se você está procurando o melhor hambúrguer artesanal feito na parrilla, o seu lugar é aqui!
        </p>
        <Link href="/menu">
            <button className="mt-8 bg-brand hover:bg-brand-dark text-white font-bold py-4 px-10 rounded-lg text-lg transition-transform duration-300 hover:scale-105 flex items-center gap-2">
                <Flame /> Ver Cardápio
            </button>
        </Link>
    </div>
  );
}