import { useState } from "react";
import {
  Container,
  Typography,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { ProductsTable } from "@/components/features/ProductsTable";
import { ProductsHeader } from "@/components/features/ProductsHeader";
import { useProducts, useUpdateProduct } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import type { ProductsQueryParams } from "@/types/product";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortParams, setSortParams] = useState<{
    field: string;
    order: "asc" | "desc";
  } | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const debouncedSearch = useDebounce(searchQuery, 500);

  const queryParams: ProductsQueryParams = {
    limit: 100,
    ...(debouncedSearch && { q: debouncedSearch }),
    ...(sortParams && { sortBy: sortParams.field, order: sortParams.order }),
  };

  const { data, isLoading, isFetching } = useProducts(
    debouncedSearch ? { q: debouncedSearch } : queryParams
  );

  const updateProduct = useUpdateProduct();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (field: string, order: "asc" | "desc") => {
    setSortParams({ field, order });
  };

  const handleProductUpdate = (id: number, data: Record<string, unknown>) => {
    updateProduct.mutate(
      { id, data },
      {
        onSuccess: () => {
          setToast({
            open: true,
            message: "Товар успешно обновлён",
            severity: "success",
          });
        },
        onError: () => {
          setToast({
            open: true,
            message: "Ошибка при обновлении товара",
            severity: "error",
          });
        },
      }
    );
  };

  const handleAddClick = () => {
    // TODO: открыть модалку добавления
    console.log("Add product clicked");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Товары
      </Typography>

      <ProductsHeader onSearch={handleSearch} onAddClick={handleAddClick} />

      {(isLoading || isFetching) && <LinearProgress sx={{ mb: 2 }} />}

      <ProductsTable
        products={data?.products || []}
        loading={isLoading}
        onSortChange={handleSortChange}
        onProductUpdate={handleProductUpdate}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
