// src/api/auth.ts
import api from "./axios";
import type { AuthResponse } from "@/types/auth";

interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      username: credentials.username,
      password: credentials.password,
    });
    return data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const { data } = await api.get<AuthResponse>("/auth/me");
    return data;
  },
};
