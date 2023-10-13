import { QueryClient, QueryCache } from '@tanstack/react-query'
import { getCoins, updateCoins } from './storage'
import { titleToSlug } from './helper'
import { api } from './api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60, // 1 minutes
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: async (error, query) => {
      if (query.state.data) {
        queryClient.setQueryData(query.queryKey, query.state.data)
        queryClient.invalidateQueries(query.queryKey)
        await queryClient.cancelQueries({ queryKey: query.queryKey })
      }
      // if (query.state.data !== undefined) {
      //   toast.error(`Something went wrong: ${error.message}`)
      // }
    }
  })
})


export const coinsQuery = () => ({
  queryKey: ['coins', 'all'],
  queryFn: fetchAllCoins,
  // add other options
})

export const coinQuery = (slug: string) => ({
  queryKey: ['coin', slug],
  queryFn: () => { 
    console.log('queryFn')
    // console.log(queryClient.getQueryData(coinsQuery().queryKey))
    const coin = queryClient.getQueryData(
      coinsQuery().queryKey)?.coins?.find(({name}) => titleToSlug(name) === slug)

    const uuid = coin?.uuid ?? undefined

    if (!uuid) {
      // throw { message: 'Not found', status: 404 }
      throw new Response('', {
        status: 404,
        statusText: 'Not Found',
      })
    }

    return fetchCoin(uuid) 
  },
  placeholderData: () => {
    console.log('placeholderData')
    // console.log(queryClient.getQueryData(coinsQuery().queryKey))
    return queryClient.getQueryData(
      coinsQuery().queryKey)?.coins?.find(({name}) => titleToSlug(name) === slug)
  },
  // add other options
})

async function fetchAllCoins() {
  try {
    const resp = await api.get('/coins.json', { 
      baseURL: 'http://localhost:8080' 
    })
    const data = resp.data?.data
    return data
  } catch (error) {
    console.warn(error)
    throw error
  }
}

async function fetchCoin(uuid: string) {
  try {
    const resp = await api.get('/coin.json', { 
      baseURL: 'http://localhost:8080' 
    })
    const data = resp.data?.data?.coin
    return data
  } catch (error) {
    console.warn(error)
    throw error
  }
}