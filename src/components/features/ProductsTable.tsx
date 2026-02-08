import { useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridSortModel,
  type GridRowModel,
  type GridRowModesModel,
  GridRowModes,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import type { Product } from "@/types/product";

export const NEW_ROW_ID = -1;

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onSortChange: (field: string, order: "asc" | "desc") => void;
  onProductUpdate: (id: number, data: Partial<Product>) => void;
  onProductAdd: (data: Partial<Product>) => Promise<void>;
  newRowId: number | null;
  onCancelNewRow: () => void;
}

export function ProductsTable({
  products,
  loading,
  onSortChange,
  onProductUpdate,
  onProductAdd,
  newRowId,
  onCancelNewRow,
}: ProductsTableProps) {
  // Локальный стейт для ширины столбцов
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const effectiveRowModesModel: GridRowModesModel =
    newRowId !== null
      ? { ...rowModesModel, [newRowId]: { mode: GridRowModes.Edit } }
      : rowModesModel;

  const getColumnWidth = (field: string, defaultWidth: number): number => {
    return columnWidths[field] || defaultWidth;
  };

  const handleSaveClick = (id: number | string) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
  };

  const handleCancelClick = (id: number | string) => () => {
    if (id === NEW_ROW_ID) {
      onCancelNewRow();
    } else {
      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      }));
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: getColumnWidth("id", 70),
      resizable: true,
      editable: false,
      renderCell: (params: GridRenderCellParams) =>
        params.value === NEW_ROW_ID ? "—" : params.value,
    },
    {
      field: "title",
      headerName: "Наименование",
      width: getColumnWidth("title", 250),
      resizable: true,
      editable: true,
    },
    {
      field: "brand",
      headerName: "Вендор",
      width: getColumnWidth("brand", 130),
      resizable: true,
      editable: true,
      renderCell: (params: GridRenderCellParams) => params.value || "—",
    },
    {
      field: "sku",
      headerName: "Артикул",
      width: getColumnWidth("sku", 130),
      resizable: true,
      editable: true,
    },
    {
      field: "price",
      headerName: "Цена",
      width: getColumnWidth("price", 100),
      resizable: true,
      editable: true,
      type: "number",
      renderCell: (params: GridRenderCellParams) =>
        params.value ? `$${params.value}` : "",
    },
    {
      field: "rating",
      headerName: "Оценка",
      width: getColumnWidth("rating", 100),
      resizable: true,
      editable: false,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value && params.value !== 0) return "—";
        return (
          <Chip
            label={Number(params.value).toFixed(1)}
            size="small"
            color={params.value < 3 ? "error" : "default"}
            sx={{
              fontWeight: params.value < 3 ? "bold" : "normal",
            }}
          />
        );
      },
    },
    {
      field: "stock",
      headerName: "Остаток",
      width: getColumnWidth("stock", 100),
      resizable: true,
      editable: true,
      type: "number",
    },
    {
      field: "minimumOrderQuantity",
      headerName: "Кратность",
      width: getColumnWidth("minimumOrderQuantity", 100),
      resizable: true,
      editable: false,
    },
    {
      field: "category",
      headerName: "Категория",
      width: getColumnWidth("category", 150),
      resizable: true,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
      getActions: ({ id }) => {
        const isNewRow = id === NEW_ROW_ID;
        if (!isNewRow) return [];

        return [
          <GridActionsCellItem
            key="save"
            icon={<Save />}
            label="Сохранить"
            onClick={handleSaveClick(id)}
            color="primary"
          />,
          <GridActionsCellItem
            key="cancel"
            icon={<Cancel />}
            label="Отмена"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      },
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

  const processRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ): Promise<GridRowModel> => {
    const isNewRow = newRow.id === NEW_ROW_ID;

    if (isNewRow) {
      if (!newRow.title || !newRow.sku || !newRow.price) {
        throw new Error(
          "Заполните обязательные поля: Наименование, Артикул, Цена"
        );
      }

      await onProductAdd(newRow as Partial<Product>);
      return oldRow;
    } else {
      const changedFields: Partial<Product> = {};
      Object.keys(newRow).forEach((key) => {
        if (newRow[key] !== oldRow[key]) {
          changedFields[key as keyof Product] = newRow[key];
        }
      });

      if (Object.keys(changedFields).length > 0) {
        onProductUpdate(newRow.id as number, changedFields);
      }

      return newRow;
    }
  };

  const handleProcessRowUpdateError = (error: Error) => {
    console.error("Row update error:", error.message);
  };

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        loading={loading}
        editMode="row"
        rowModesModel={effectiveRowModesModel}
        onRowModesModelChange={setRowModesModel}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        onSortModelChange={handleSortChange}
        onColumnResize={handleColumnResize}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
