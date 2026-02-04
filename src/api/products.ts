import api from "./axios";
import type {
  Product,
  ProductsResponse,
  ProductsQueryParams,
  ProductFormData,
} from "@/types/product";

export const productsApi = {
  getAll: async (params?: ProductsQueryParams): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>("/products", { params });
    return data;
  },

  search: async (query: string): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>("/products/search", {
      params: { q: query },
    });
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  create: async (product: ProductFormData): Promise<Product> => {
    const { data } = await api.post<Product>("/products/add", product);
    return data;
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const { data } = await api.put<Product>(`/products/${id}`, product);
    return data;
  },

  delete: async (id: number): Promise<Product & { isDeleted: boolean }> => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};
