import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getStoredAuth, setStoredAuth, clearStoredAuth } from "@/utils/storage";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    token: string,
    refreshToken: string,
    user: User,
    rememberMe: boolean
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setToken(stored.token);
      setUser(stored.user);
    }
    setIsLoading(false);
  }, []);

  const login = (
    token: string,
    refreshToken: string,
    user: User,
    rememberMe: boolean
  ) => {
    setToken(token);
    setUser(user);
    setStoredAuth({ token, refreshToken, user }, rememberMe);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
