import { BACKEND_SERVER } from './config'

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import {
  errorInterceptor,
  requestInterceptor,
  successInterceptor,
} from './interceptors'

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: BACKEND_SERVER,
  timeout: 10000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  },
}

const api: AxiosInstance = axios.create(axiosRequestConfig)

api.interceptors.request.use(requestInterceptor)
api.interceptors.response.use(successInterceptor, errorInterceptor)

export { api }
