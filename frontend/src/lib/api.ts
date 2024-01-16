import axios, {
  type AxiosInstance, 
  type AxiosRequestConfig 
} from 'axios'
import {
  errorInterceptor,
  requestInterceptor,
  successInterceptor,
} from './interceptors'

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BACKEND_SERVER,
  timeout: 15000,
  // headers: {
  //   'Content-Type': 'application/json'
  // },
}

const api: AxiosInstance = axios.create(axiosRequestConfig)

api.interceptors.request.use(requestInterceptor)
api.interceptors.response.use(successInterceptor, errorInterceptor)

export { api }
