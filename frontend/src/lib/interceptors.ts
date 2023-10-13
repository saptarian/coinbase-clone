import {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { getToken } from 'lib/storage'
import { type ModAxiosResponse } from '$/types'


export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => 
{
  const token = getToken()

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
}

export const successInterceptor = (response: AxiosResponse): ModAxiosResponse => {
  return {
    status: response.status,
    message: response.data?.message ?? response.data?.msg ?? '',
    data: response.data,
  }
}

export const errorInterceptor = async (error: AxiosError): Promise<void> => {
  await Promise.reject({
    status: error.response?.status ?? 414,
    message: error.response?.data.message ?? error.response?.data.msg ?? error.message,
    data: error.response ?? error,
  })
}
