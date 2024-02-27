import type { BodySetupIdentity, SigninValues, SignupValues } from '@/types'
import { isTokenExpired } from './validation'
import * as Store from './storage'
import { api } from './api'
import { AxiosResponse } from 'axios'
import { queryClient } from './queries'


export type PostBodyType = {[K in string]: string}
type TokenOK = {
  ok: boolean
  err: { message: string, status: number }
}


export function isTokenOK(): TokenOK {
  let ok = true
  const err = { message: '', status: 401 }
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
    Store.storeAuth(null) // remove from storage
  }

  return {ok, err}
}


export function isLoggedIn(): boolean {
  return isTokenOK().ok
}


export async function signin(body: SigninValues) {
  return await api.post('/auth/signin', body)
  .then((resp) => {
    Store.storeAuth({token: resp.data?.access_token})
    Store.storeUser(null)
    return resp
  })
}


export async function signup(body: SignupValues) {
  return await api.post('/auth/signup', body)
  .then((resp) => {
    Store.storeAuth({token: resp.data?.access_token})
    return resp
  })
}


export function clearRss() {
  queryClient.removeQueries({ queryKey: ['wallet'] })
  queryClient.removeQueries({ queryKey: ['transaction'] })
}

export function clearAuth() {
  Store.storeUser(null)
  Store.storeAuth(null)
}


function testToken() {
  const {ok, err} = isTokenOK()
  // console.log('testToken', {ok, err})
  if (!ok)
    throw err
}


async function authRequired<T extends AxiosResponse>(func: () => Promise<T>) {
  testToken()

  return await func().catch(
  (err) => {
    if (err.status === 401) {
      clearRss()
      clearAuth()
    }
    throw err
  })
}


export async function signout() {
  clearRss()
  if (!isLoggedIn) {
    Store.storeUser(null)
    return
  }
  return await authRequired(() => api.delete('/auth/signout'))
  .then(() => {
    clearAuth()
    return
  })
  .catch(err => {
    clearAuth()
    throw err
  })

}


export async function validateJWT() {
  return await authRequired(() => api.get('/auth/validate'))
}


export async function validateIdentity() {
  return await authRequired(() => api.get('/auth/validate/identity'))
}


export async function validatePhone() {
  return await authRequired(() => api.get('/auth/validate/phone'))
}


export async function fetchUser() {
  return await authRequired(async () => {
    const data = await api.get('/user/')
    Store.storeUser({user: data?.data})
    return data
  })
}


export async function fetchPhoneNumbers() {
  return await authRequired(async () => {
    const data = await api.get('/user/phones')
    Store.storeUser(data?.data)
    return data
  })
}


export async function fetchProfile() {
  return await authRequired(async () => {
    const data = await api.get('/user/profile')
    Store.storeUser(data?.data)
    return data
  })
}


export async function createIdentity(body: BodySetupIdentity) {
  return await authRequired(() => 
    api.post('/user/create/identity', body))
}


export async function createPhone(body: PostBodyType) {
  return await authRequired(() => 
    api.post('/user/create/phone', body))
}


export async function fetchPhoneNumber() {
  return await authRequired(() => api.get('/user/phone'))
}


export async function updatePhoneNumber(body: PostBodyType) {
  return await authRequired(() => 
    api.post('/user/update/phone', body))
}


export async function updateAddress(body: PostBodyType) {
  return await authRequired(() => 
    api.post('/user/update/address', body))
}


export async function deletePhone(body: PostBodyType) {
  return await authRequired(() => 
    api.post('/user/phone', body))
}


export async function updatePrimaryPhone(body: PostBodyType) {
  return await authRequired(() => 
    api.post('/user/update/primary-phone', body))
}


export async function addPhone(body: PostBodyType) {
  return await authRequired(() => 
    api.post('/user/add/phone', body))
}


export async function updateDateOfBirth(body: PostBodyType) {
  return await authRequired(() => 
    api.post('/user/update/date_of_birth', body))
}


export async function updatePassword(body: PostBodyType) {
  return await authRequired(() => 
    api.post('/user/update/password', body))
}


export async function updateAvatar(
  formData: {[K in string]: FormDataEntryValue}
) {
  return await authRequired(() => 
    api.post('/user/update/avatar', formData))
}


export async function fetchAvatar() {
  return await authRequired(async () => {
    return await api.get('/user/avatar', {
      responseType: 'blob'
    })
  })
}


export async function updateUser(body: PostBodyType) {
  return await authRequired(() => 
    api.post('/user/update', body))
}


export async function fetchUserWallets(symbol: string = '') {
  return await authRequired(() => 
    api.get('/wallet/' + symbol))
}


export async function createOrder(body: PostBodyType)
{
  return await authRequired(() => 
    api.post('/orderbook/', body))
}


export async function completeOrder(body: PostBodyType)
{
  return await authRequired(() => 
    api.post('/orderbook/complete', body))
}


export async function fetchUserTransactions(symbol: string = '') {
  return await authRequired(() => 
    api.get('/transaction/' + symbol))
}


const CRYPTO_PATH = "/cryptocurrency"

export async function getIdMap(
  params: Record<string, string> = {}
) 
{
  const queries = new URLSearchParams(params)
  return await api.get(`${CRYPTO_PATH}/id-map${
      Object.keys(params).length ? '?' + queries.toString() : ''
    }`
  )
}


export async function getQuote(
  params: Record<string, string> = {}
) 
{
  const queries = new URLSearchParams(params)
  return await authRequired(() => 
    api.get(`${CRYPTO_PATH}/quote${
      Object.keys(params).length ? '?' + queries.toString() : ''
    }`
  ))
}


export async function getQuotes(
  params: Record<string, string> = {}
) 
{
  const queries = new URLSearchParams(params)
  return await api.get(`${CRYPTO_PATH}/quotes${
      Object.keys(params).length ? '?' + queries.toString() : ''
    }`
  )
}


export async function getMetadata(
  params: Record<string, string> = {}
) 
{
  const queries = new URLSearchParams(params)
  return await authRequired(() => 
    api.get(`${CRYPTO_PATH}/metadata${
      Object.keys(params).length ? '?' + queries.toString() : ''
    }`
  ))
}


export async function getGlobalStatistic() {
  return await api.get(`${CRYPTO_PATH}/global-statistic`)
}


export async function getHistoricalData(
  symbol: string, 
  years: number = 4
) 
{
  return await api.get(`${CRYPTO_PATH}/historical-data/${
      symbol ? symbol + '-USD' : ''
    }${
      years ? '?years='+years : ''
    }`
  )
}


export async function getSparkData(symbol: string)
{
  return await api.get(
    `${CRYPTO_PATH}/spark-data/${
      symbol ? symbol + '-USD' : ''
    }`
  )
}


export async function getListCrypto(
  params: Record<string, string> = {}
) 
{
  const queries = new URLSearchParams(params)
  return await api.get(`${CRYPTO_PATH}/list-crypto${
      Object.keys(params).length ? '?' + queries.toString() : ''
    }`
  )
}


export async function getFiat(symbol: string = '') {
  return await api.get(`${CRYPTO_PATH}/fiat${
      symbol ? '?symbol='+symbol : ''
    }`
  )
}


export async function getFiatRates(symbols?: string) {
  return await api.get(`${CRYPTO_PATH}/fiat-rates${
      symbols ? '?symbols='+symbols : ''
    }`
  )
}


export async function getLatestNews(limit: number = 5) {
  return await api.get(`${CRYPTO_PATH}/latest-news/${limit}`)
}
