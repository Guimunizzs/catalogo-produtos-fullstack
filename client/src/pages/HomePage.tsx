import { useState } from "react";
import { type Product } from "../types/product";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Nosso Catálogo de Produtos
      </h1>
      <p>... Em breve, a lista de produtos estará disponível.</p>
    </div>
  );
};
