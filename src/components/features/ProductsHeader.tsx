import { useState, useEffect } from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import { Search, Logout } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductsHeaderProps {
  onSearch: (query: string) => void;
}

export function ProductsHeader({ onSearch }: ProductsHeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const { user, logout } = useAuth();

  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <TextField
        placeholder="Поиск товаров..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        sx={{ minWidth: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button variant="outlined" startIcon={<Logout />} onClick={logout}>
          {user?.firstName || "Выход"}
        </Button>
      </Box>
    </Box>
  );
}
