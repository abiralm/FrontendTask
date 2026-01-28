import { AuthType, LoginResponse, RegisterResponse } from "@/types/authTypes";
import { api } from "./axios";

export const registerUser = async (data: AuthType,): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/register", data);
    return response.data;
};

export const login = async (data: AuthType): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/login", data);
    return response.data;
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<string> => {
  const res = await api.post<{ accessToken: string }>("/refresh", {
    refreshToken,
  });
  return res.data.accessToken;
};

export const getInvoices = async (): Promise<any> => {
  const res = await api.get("/invoices");
  return res.data;
};
