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
