import { api } from 'root/lib/api'
import { type LoginBody, type GetLoginResponse } from 'root/types/auth'

export const login = async (body: LoginBody): Promise<GetLoginResponse> => {
  const { data } = await api.post<GetLoginResponse>('/auth/signin', body)
  return data
}
