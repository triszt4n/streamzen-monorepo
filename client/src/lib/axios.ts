import axios from "axios"

export const myAxios = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_BACKEND_URL,
})
