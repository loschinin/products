import { useState } from "react";
import {
  Container,
  Typography,
  LinearProgress,
  Snackbar,
  Alert,
  Stack,
  Paper,
  Button,
  Tooltip,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { ProductsTable, NEW_ROW_ID } from "@/components/features/ProductsTable";
import { ProductsHeader } from "@/components/features/ProductsHeader";
import {
  useProducts,
  useAddProduct,
  useUpdateProduct,
} from "@/hooks/useProducts";
import type { Product, ProductsQueryParams } from "@/types/product";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortParams, setSortParams] = useState<{
    field: string;
    order: "asc" | "desc";
  } | null>(null);
  const [newRowId, setNewRowId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const queryParams: ProductsQueryParams = {
    limit: 100,
    ...(searchQuery && { q: searchQuery }),
    ...(sortParams && { sortBy: sortParams.field, order: sortParams.order }),
  };

  const { data, isLoading, isFetching, refetch } = useProducts(queryParams);

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const getDisplayProducts = (): Product[] => {
    const products = data?.products || [];

    if (newRowId !== null) {
      const emptyRow: Product = {
        id: NEW_ROW_ID,
        title: "",
        brand: "",
        sku: "",
        price: 0,
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
        availabilityStatus: "",
        reviews: [],
        returnPolicy: "",
        meta: { createdAt: "", updatedAt: "", barcode: "", qrCode: "" },
        images: [],
        thumbnail: "",
      };
      return [emptyRow, ...products];
    }

    return products;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (field: string, order: "asc" | "desc") => {
    setSortParams({ field, order });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleProductUpdate = (id: number, updates: Partial<Product>) => {
    updateProduct.mutate(
      { id, data: updates },
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

  const handleProductAdd = async (
    productData: Partial<Product>
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      addProduct.mutate(
        {
          title: productData.title || "",
          price: productData.price || 0,
          brand: productData.brand,
          sku: productData.sku || "",
        },
        {
          onSuccess: () => {
            setNewRowId(null);
            setToast({
              open: true,
              message: "Товар успешно добавлен",
              severity: "success",
            });
            resolve();
          },
          onError: (error) => {
            setToast({
              open: true,
              message: "Ошибка при добавлении товара",
              severity: "error",
            });
            reject(error);
          },
        }
      );
    });
  };

  const handleAddClick = () => {
    if (newRowId === null) {
      setNewRowId(NEW_ROW_ID);
    }
  };

  const handleCancelNewRow = () => {
    setNewRowId(null);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ display: "flex", flexDirection: "column", py: 3, gap: 2 }}
    >
      <Paper>
        <Stack
          flexDirection="row"
          gap={2}
          p="26px"
          justifyContent="space-between"
        >
          <Typography variant="h4">Товары</Typography>
          <ProductsHeader onSearch={handleSearch} />
        </Stack>
      </Paper>
      {(isLoading || isFetching) && <LinearProgress sx={{ mb: 2 }} />}

      <Paper>
        <Stack flexDirection="row" gap={2} justifyContent="space-between" p={2}>
          <Typography variant="h6">Все позиции</Typography>
          <Stack flexDirection="row" gap={1}>
            <Tooltip title="Обновить">
              <Button
                variant="outlined"
                onClick={handleRefresh}
                disabled={isFetching}
                color="neutral"
                sx={{
                  minWidth: "auto",
                  px: 1,
                }}
              >
                <CachedIcon />
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<ControlPointIcon />}
              onClick={handleAddClick}
            >
              Добавить
            </Button>
          </Stack>
        </Stack>
        <ProductsTable
          products={getDisplayProducts()}
          loading={isLoading}
          onSortChange={handleSortChange}
          onProductUpdate={handleProductUpdate}
          onProductAdd={handleProductAdd}
          newRowId={newRowId}
          onCancelNewRow={handleCancelNewRow}
        />
      </Paper>
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
