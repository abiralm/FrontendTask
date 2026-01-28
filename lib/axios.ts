import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "@/lib/api";
import { clearRefreshToken, getRefreshToken } from "./auth/authStorage";

export const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken: string | null = null;

export const setAxiosAccessToken = (token: string | null) => {
  accessToken = token;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 403 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw error;
        }

        const newAccessToken =
          await refreshAccessToken(refreshToken);

        setAxiosAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err: any) {
        processQueue(err, null);
        clearRefreshToken();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
