import axios from "axios";

export const inventoryApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});
