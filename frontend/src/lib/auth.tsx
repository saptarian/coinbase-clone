import * as React from 'react'
import { 
  type SigninBody, 
  type SignupBody,
  type ModAxiosResponse,
  type FetchState
} from '$/types'
import { api } from './api'
import * as Store from './storage'
import { json, } from "react-router-dom"
import { isTokenExpired } from './validation'


interface TokenOK {
  ok: boolean
  err: { message: string, status: number }
}

export function isTokenOK(): TokenOK {
  let ok = true
  let err = { message: '', status: 401 }
  const token = Store.getToken()

  // no token found just return earlier
  if (!token) {
    ok = false
    err.message = 'Authentication required'
  }

  // token found check by client is it expired?
  else if (isTokenExpired(token)) {
    ok = false
    err.message = 'Token is expired or invalid'
    Store.updateAuth(null) // remove from storage
  }

  return {ok, err}
}

export function isLoggedIn(): boolean {
  return isTokenOK().ok
}

export async function signin(body: SigninBody) {
  try {
    const data = await api.post('/auth/signin', body)
    Store.updateAuth({token: data.data?.access_token})
    return data
  } catch (error) {
    throw error
  }
}

export async function signup(body: SignupBody) {
  try {
    const data = await api.post('/auth/signup', body)
    Store.updateAuth({token: data.data?.access_token})
    return data
  } catch (error) {
    throw error
  }
}

export async function signout(callback: VoidFunction) {
  if (!isLoggedIn) {
    callback()
    Store.updateUser(null)
    return json({message: 'Logged out'})
  }

  try {
    const data = await api.delete('/auth/signout')
    Store.updateUser(null)
    Store.updateAuth(null)
    callback()
    return data
  } catch (error) {
    throw error
  }
}

export async function validateJWT() {
  const {ok, err} = isTokenOK()
  if (!ok)
    throw err

  return await api.get('/auth/validate')
}

export async function validateIdentity() {
  const {ok, err} = isTokenOK()
  if (!ok)
    throw err

  return await api.get('/auth/validate/identity')
}

export async function validatePhone() {
  const {ok, err} = isTokenOK()
  if (!ok)
    throw err

  return await api.get('/auth/validate/phone')
}

export async function getUser() {
  const {ok, err} = isTokenOK()
  if (!ok)
    throw err

  try {
    const data = await api.get('/auth/user')
    Store.updateUser({user: data?.data})
    return data
  } catch (error) {
    throw error
  }
}

export async function getProfile() {
  const {ok, err} = isTokenOK()
  if (!ok)
    throw err

  try {
    const data = await api.get('/auth/profile')
    Store.updateUser(data?.data)
    return data
  } catch (error) {
    throw error
  }
}

export async function createIdentity(body: unknown) {
  const {ok, err} = isTokenOK()
  if (!ok)
    throw err

  return await api.post('/auth/create/identity', body)
}

export async function createPhone(body: unknown) {
  const {ok, err} = isTokenOK()
  if (!ok)
    throw err

  return await api.post('/auth/create/phone', body)
}
