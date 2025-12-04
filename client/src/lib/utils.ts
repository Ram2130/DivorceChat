import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
 
import axios from 'axios';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
 
const API_URL =  "https://heydivo.com";
console.log(API_URL)
//const API_URL = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
    baseURL:`${API_URL}/api`,
    headers:{
        "Content-Type": "application/json"
        
    }
})


//✅ Automatically attach JWT token from localStorage (or sessionStorage)
  api.interceptors.request.use(
  (config) => {
    const token =  localStorage.getItem("token"); 
    console.log("token",token)// you can also use sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const callApi = async (method:any, endpoint:any, data = {}, params = {}) => {
  try {
    const response = await api({
      method,   // 'get', 'post', 'put', 'delete'
      url: endpoint,
      data,     // request body
      params,   // query params
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
