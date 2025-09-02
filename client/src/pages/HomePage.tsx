import { useState, useEffect } from "react";
import { type Product } from "../types/product";
import { getProducts } from "../services/api";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError("Erro ao buscar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Carregando Produtos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Nosso Catálogo de Produtos
      </h1>

      {products.length === 0 ? (
        <p className="">Nenhum produto cadastrado ainda</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {product.image_path ? (
                <img
                  src={`http://localhost:3001${product.image_path}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-gray-600 mt-2 flex-grow">
                  {product.descripition}
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-4">
                  R$ {Number(product.price).toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
