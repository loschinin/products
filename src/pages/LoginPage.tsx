import { Box, Typography, Paper } from "@mui/material";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/features/LoginForm";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Если уже авторизован — редирект
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Typography variant="h5" component="h1">
          Вход в систему
        </Typography>
        <LoginForm />
        <Typography variant="body2" color="text.secondary">
          Тест: emilys / emilyspass
        </Typography>
      </Paper>
    </Box>
  );
}
