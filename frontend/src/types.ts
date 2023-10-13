export interface ModAxiosResponse {
  status: number
  message: string
  data: unknown
}

export interface SigninBody {
  email: string
  password: string
}

export interface SignupBody {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface FetchState {
  data: ModAxiosResponse | null
  error: ModAxiosResponse | null
  status: string
}