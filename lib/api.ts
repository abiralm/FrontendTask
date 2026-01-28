import { AuthType, LoginResponse, RegisterResponse } from "@/types/authTypes";
import axios from "./axios";

export const registerUser = async (data: AuthType): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>("/register", data);
  return response.data;
};

export const login = async (data: AuthType): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>("/login", data);
  return response.data;
};


