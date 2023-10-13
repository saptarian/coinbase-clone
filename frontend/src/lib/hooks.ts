import { useQueryClient, useQuery } from '@tanstack/react-query'
import { coinsQuery, coinQuery } from 'lib/queries'


export function useCoins() {
  // const queryClient = useQueryClient()
  const { data, isLoading } = useQuery(coinsQuery())
  return { data, isLoading }
}

export function useCoin(slug: string) {
  // const queryClient = useQueryClient()
  const { data, isLoading } = useQuery(coinQuery(slug))
  return { data, isLoading }
}