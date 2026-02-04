import type { User } from "@/types/auth";

interface StoredAuth {
  token: string;
  refreshToken: string;
  user: User;
}

const AUTH_KEY = "auth";

export function getStoredAuth(): StoredAuth | null {
  const stored =
    localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setStoredAuth(data: StoredAuth, rememberMe: boolean): void {
  const storage = rememberMe ? localStorage : sessionStorage;
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
  storage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}
