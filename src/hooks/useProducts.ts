// src/hooks/useProducts.ts
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
};

export function useProducts(params: ProductsQueryParams = {}) {
  // Проверяем есть ли непустой поисковый запрос
  const searchQuery = params.q?.trim() || "";
  const isSearch = searchQuery.length > 0;

  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => {
      if (isSearch) {
        return productsApi.search(searchQuery);
      }
      // Убираем q из параметров для обычного запроса
      const { q, ...restParams } = params;
      return productsApi.getAll(restParams);
    },
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => productsApi.create(data),
    onSuccess: (newProduct, variables) => {
      // Обновляем все кэши с продуктами
      queryClient.setQueriesData<{
        products: Product[];
        total: number;
        skip: number;
        limit: number;
      }>({ queryKey: productKeys.all }, (oldData) => {
        if (!oldData) return oldData;

        const fullProduct: Product = {
          id: newProduct.id,
          title: variables.title,
          price: variables.price,
          brand: variables.brand || "",
          sku: variables.sku,
          rating: 0,
          stock: 0,
          minimumOrderQuantity: 1,
          category: "",
          description: "",
          discountPercentage: 0,
          tags: [],
          weight: 0,
          dimensions: { width: 0, height: 0, depth: 0 },
          warrantyInformation: "",
          shippingInformation: "",
          availabilityStatus: "In Stock",
          reviews: [],
          returnPolicy: "",
          meta: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            barcode: "",
            qrCode: "",
          },
          images: [],
          thumbnail: "",
        };

        return {
          ...oldData,
          products: [fullProduct, ...oldData.products],
          total: oldData.total + 1,
        };
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      productsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: productKeys.all });

      const previousData = queryClient.getQueriesData({
        queryKey: productKeys.all,
      });

      queryClient.setQueriesData<{
        products: Product[];
        total: number;
        skip: number;
        limit: number;
      }>({ queryKey: productKeys.all }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: oldData.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: productKeys.all });

      const previousData = queryClient.getQueriesData({
        queryKey: productKeys.all,
      });

      queryClient.setQueriesData<{
        products: Product[];
        total: number;
        skip: number;
        limit: number;
      }>({ queryKey: productKeys.all }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: oldData.products.filter((p) => p.id !== id),
          total: oldData.total - 1,
        };
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
}
