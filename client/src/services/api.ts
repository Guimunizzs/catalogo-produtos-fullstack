import axios from "axios";
import { type Product } from "../types/product";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

interface LoginResponse {
  message: string;
  token: string;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>("/products");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export const loginAdmin = async (credentials: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const createProduct = async (
  productData: FormData,
  token: string
): Promise<Product> => {
  try {
    const response = await apiClient.post("/products", productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productData: FormData,
  token: string
): Promise<any> => {
  try {
    const response = await apiClient.put(`/products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
};

export const deleteProduct = async (
  id: number,
  token: string
): Promise<any> => {
  try {
    const response = await apiClient.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    throw error;
  }
};
