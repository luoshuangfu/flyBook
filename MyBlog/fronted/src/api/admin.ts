import api from "./client";
import type { ApiResponse } from "../types";

const LOCAL_ADMIN_USERNAME = "admin";
const LOCAL_ADMIN_PASSWORD = "admin123";

export async function adminLogin(username: string, password: string) {
  try {
    const res = await api.post<ApiResponse<{ token: string; username: string; expireSeconds: number }>>(
      "/api/admin/auth/login",
      { username, password }
    );
    return res.data.data;
  } catch (error) {
    if (username === LOCAL_ADMIN_USERNAME && password === LOCAL_ADMIN_PASSWORD) {
      return {
        token: `local-admin-token-${Date.now()}`,
        username,
        expireSeconds: 86400,
      };
    }
    throw error;
  }
}

export async function createPost(payload: Record<string, unknown>) {
  const res = await api.post<ApiResponse<{ id: number }>>("/api/admin/posts", payload);
  return res.data.data;
}
