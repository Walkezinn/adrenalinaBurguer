export default function Footer() {
    const year = new Date().getFullYear();
    return (
      <footer className="bg-gray-950 border-t border-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {year} Adrenalina Burguer. Todos os direitos reservados.</p>
          <p className="mt-1">"Se você está procurando o melhor hambúrguer artesanal feito na parrilla, o seu lugar é aqui!"</p>
        </div>
      </footer>
    );
}