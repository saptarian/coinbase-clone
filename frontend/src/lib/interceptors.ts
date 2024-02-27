import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ModAxiosResponse, BasicResponseJSON } from '@/types'
import { getToken } from '@/lib/storage'
import axios from 'axios'


export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => 
{
  const token = getToken()

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  config.headers.set('X-Api', 'v1')
  return config
}

export const successInterceptor = (
  response: AxiosResponse<BasicResponseJSON>
): ModAxiosResponse => 
{
  return {
    ...response,
    message: response.data?.message ?? response.data?.msg ?? '',
  }
}

export const errorInterceptor = async (
  error: AxiosError<BasicResponseJSON>
): Promise<void> => 
{
  await Promise.reject({
    status: error.response?.status ?? 414,
    message: error.response?.data.message ?? error.response?.data.msg ?? error.message,
    data: error.response ?? error,
  })
}


interface IErrorBase<T> {
  error: Error | AxiosError<T>
  type: 'axios-error' | 'stock-error'
}

interface IAxiosError<T> extends IErrorBase<T>  {
  error: AxiosError<T>
  type: 'axios-error'
}

interface IStockError<T> extends IErrorBase<T> {
  error: Error
  type: 'stock-error'
}

export function axiosErrorHandler<T>(
  callback: (err: IAxiosError<T> | IStockError<T>) => void
) {
  return (error: Error | AxiosError<T>) => {
    if (axios.isAxiosError(error))
      callback({ error, type: 'axios-error' })
    else
      callback({ error, type: 'stock-error' })
  }
}
