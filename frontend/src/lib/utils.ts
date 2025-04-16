import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios, { AxiosInstance } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let axiosInstance: AxiosInstance | null = null;

export function getAxiosInstance(): AxiosInstance {
  if (axiosInstance) {
    return axiosInstance;
  }
  axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URI || "http://127.0.0.1:5000",
    headers: {
      "Content-Type": "application/json",
    },
    url: process.env.NEXT_PUBLIC_BACKEND_URI || "http://127.0.0.1:5000",
  });
  return axiosInstance;
}
