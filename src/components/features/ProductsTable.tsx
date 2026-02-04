import { useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridSortModel,
} from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import type { Product } from "@/types/product";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onSortChange: (field: string, order: "asc" | "desc") => void;
  onProductUpdate: (id: number, data: Partial<Product>) => void;
}

export function ProductsTable({
  products,
  loading,
  onSortChange,
  onProductUpdate,
}: ProductsTableProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: columnWidths.id || 70,
      resizable: true,
    },
    {
      field: "title",
      headerName: "Наименование",
      width: columnWidths.title || 250,
      resizable: true,
      editable: true,
    },
    {
      field: "brand",
      headerName: "Вендор",
      width: columnWidths.brand || 130,
      resizable: true,
      editable: true,
      renderCell: (params: GridRenderCellParams) => params.value || "—",
    },
    {
      field: "sku",
      headerName: "Артикул",
      width: columnWidths.sku || 130,
      resizable: true,
      editable: true,
    },
    {
      field: "price",
      headerName: "Цена",
      width: columnWidths.price || 100,
      resizable: true,
      editable: true,
      type: "number",
      renderCell: (params: GridRenderCellParams) => `$${params.value}`,
    },
    {
      field: "rating",
      headerName: "Оценка",
      width: columnWidths.rating || 100,
      resizable: true,
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value?.toFixed(1)}
          size="small"
          color={params.value < 3 ? "error" : "default"}
          sx={{
            fontWeight: params.value < 3 ? "bold" : "normal",
          }}
        />
      ),
    },
    {
      field: "stock",
      headerName: "Остаток",
      width: columnWidths.stock || 100,
      resizable: true,
      editable: true,
      type: "number",
    },
    {
      field: "minimumOrderQuantity",
      headerName: "Кратность",
      width: columnWidths.minimumOrderQuantity || 100,
      resizable: true,
      editable: false,
    },
    {
      field: "category",
      headerName: "Категория",
      width: columnWidths.category || 150,
      resizable: true,
      editable: true,
    },
  ];

  const handleSortChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const { field, sort } = model[0];
      if (sort) {
        onSortChange(field, sort);
      }
    }
  };

  const handleColumnResize = (params: {
    colDef: { field: string };
    width: number;
  }) => {
    setColumnWidths((prev) => ({
      ...prev,
      [params.colDef.field]: params.width,
    }));
  };

  const handleCellEdit = (params: {
    id: number;
    field: string;
    value: unknown;
  }) => {
    onProductUpdate(params.id, { [params.field]: params.value });
  };

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        onSortModelChange={handleSortChange}
        onColumnResize={handleColumnResize}
        processRowUpdate={(newRow, oldRow) => {
          const changedField = Object.keys(newRow).find(
            (key) =>
              newRow[key as keyof typeof newRow] !==
              oldRow[key as keyof typeof oldRow]
          );
          if (changedField) {
            handleCellEdit({
              id: newRow.id,
              field: changedField,
              value: newRow[changedField as keyof typeof newRow],
            });
          }
          return newRow;
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
