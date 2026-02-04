import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import type {
  Product,
  ProductsQueryParams,
  ProductFormData,
} from "@/types/product";

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductsQueryParams) =>
    [...productKeys.all, "list", params] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
};

export function useProducts(params: ProductsQueryParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.getAll(params),
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: [...productKeys.all, "search", query],
    queryFn: () => productsApi.search(query),
    enabled: query.length > 0,
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
