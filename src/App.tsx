import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import ProductsPage from "@/pages/ProductsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}

export default App;
