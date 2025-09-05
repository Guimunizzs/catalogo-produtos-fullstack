import { useState, useEffect } from "react";
import { type Product } from "../types/product.ts";
import { getProducts, createProduct, deleteProduct } from "../services/api.ts";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      setError("Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token || !image) {
      setError("Token de autenticação ou imagem não fornecidos");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price?.toString() || "");
    formData.append("image", image);

    try {
      await createProduct(formData, token);
      alert("Produto criado com sucesso");
      setName("");
      setDescription("");
      setPrice(null);
      setImage(null);
    } catch (error) {
      setError("Erro ao criar produto");
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Token de autenticação não fornecido");
      return;
    }

    try {
      await deleteProduct(productId, token);
      alert("Produto deletado com sucesso");
      fetchProducts();
    } catch (error) {
      setError("Erro ao deletar produto");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Produto</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome do Produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Preço"
              value={price ?? ""}
              onChange={(e) =>
                setPrice(e.target.value === "" ? null : Number(e.target.value))
              }
              required
              className="p-2 border rounded"
              step="0.01"
            />
          </div>
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-4 p-2 border rounded"
          />
          <input
            type="file"
            onChange={handleImageChange}
            required
            className="w-full mt-4"
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Adicionar Produto
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Produtos Cadastrados</h2>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
            >
              <span>
                {product.name} - R$ {Number(product.price).toFixed(2)}
              </span>
              <Link
                to={`/admin/edit/${product.id}`}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(Number(product.id))}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
