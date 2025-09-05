import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../services/api";
import { type Product } from "../types/product";

const AdminEditProductPage = () => {
  const productId = useParams().productId as string;
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
        setName(data.name);
        setDescription(data.descripition || "");
        setPrice(String(data.price));
      } catch (error) {
        console.error("Erro ao buscar produto para edição", error);
        alert("Produto não encontrado");
        navigate("/admin/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit");
    const token = localStorage.getItem("authToken");
    console.log("token:", token);
    console.log("product:", product);
    if (!token || !product) {
      console.log("Sem token ou produto");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    if (image) {
      formData.append("image", image);
    } else if (product?.image_path) {
      formData.append("existing_image_path", product.image_path);
    }

    try {
      console.log("Chamando updateProduct");
      const resp = await updateProduct(product.id, formData, token);
      console.log("Resposta updateProduct", resp);
      alert("Produto atualizado com sucesso");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar produto", error);
      alert("Erro ao atualizar produto");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Editar Produto</h1>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome do Produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Preço"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
          ></textarea>
          <div className="mt-4">
            <label>Mudar Imagem (opcional):</label>
            <input
              type="file"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
              className="w-full mt-2"
            />
            {product?.image_path && !image && (
              <img
                src={`http://localhost:3001${product.image_path}`}
                alt="Imagem atual"
                className="w-32 h-32 mt-2 object-cover"
              />
            )}
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProductPage;
