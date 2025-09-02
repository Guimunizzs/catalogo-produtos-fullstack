import axios from "axios";
import { type Product } from "../types/product";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>("/products");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};
