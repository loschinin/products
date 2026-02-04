import api from "./axios";
import type { LoginCredentials, AuthResponse } from "@/types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const { data } = await api.get<AuthResponse>("/auth/me");
    return data;
  },
};
