import React from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import { useSubmit, useFetcher } from "react-router-dom"
import { 
  getLogoById,
  walletQuery,
  fiatMapQuery,
  coinListQuery, 
  sparkDataQuery,
  fiatRatesQuery,
  latestNewsQuery,
  walletListQuery,
  coinDetailQuery,
  historicalDataQuery,
  coinListSearchQuery,
  transactionListQuery,
  coinGlobalStatisticQuery,
} from '@/lib/queries'
import { 
  NewsCard,
  CryptoList, 
  WalletType,
  SortByOption, 
  SortableHeader,
  HistoricalData,
  CryptoWithLogo,
  CryptoListView,
  CryptoDetailed, 
  GlobalStatistic,
  TransactionType, 
  CoinQueryOptions, 
  WalletOrNotFound, 
  CryptoWithNumeric,
} from '@/types'


const COIN_LIST_COUNT_PER_PAGE = 200
const A_DAY_IN_MILLISECONDS = (1000 * 3600 * 24)
const getCoinListQueries = ({index, limit}: {
  index: number
  limit: number
}) => 
{
  const leftIdx = index+1
  const rightIdx = limit+1
  const totalPages = Math.ceil(
    (rightIdx - leftIdx) / COIN_LIST_COUNT_PER_PAGE
  )
  const leftPage = Math.ceil(
    leftIdx / COIN_LIST_COUNT_PER_PAGE
  )
  return Array.from(
    {length: totalPages}, 
    (_,idx) => coinListQuery(idx + leftPage)
  )
}


export function useCoins(options: CoinQueryOptions = {} ) {
  const {
    index = 0,
    limit = 25,
    search = '',
    currency = 'USD',
    sortBy,
  } = options

  const results = useQueries({
    queries: search.length < 3 
      ? getCoinListQueries({index, limit})
      : [coinListSearchQuery(search)]
  })
  const isLoading = results.some((res) => res.isLoading)
  const count = results[0]?.data?.status?.total_count ?? 0
  let data: CryptoList[] = []
  for (const res of results) {
    if (res.data?.data)
      data = data.concat(res.data.data)
  }

  let coins: Array<CryptoList> | undefined
  let coinsExt: Array<CryptoListView> | undefined
  // console.log('useCoins.used', {options, isLoading, data, results})

  if (data.length) {
    if (search.trim().length > 2)
      coins = data.filter(({name, symbol}) => 
        name.toLowerCase().includes(
          search.trim().toLowerCase()) || 
        symbol.toLowerCase().includes(
          search.trim().toLowerCase()))

    else
      coins = Array.from(data)

    if (sortBy)
      switch(sortBy) {
        case 'price':
          coins = coins.sort((after, before) => 
            before.quote?.[currency]?.price -
            after.quote?.[currency]?.price
          )
          break
        case 'change':
          coins = coins.sort((after, before) => 
            before.quote?.[currency]?.percent_change_24h -
            after.quote?.[currency]?.percent_change_24h
          )
          break
        case 'market-cap':
          coins = coins.sort((after, before) => 
            before.quote?.[currency]?.market_cap -
            after.quote?.[currency]?.market_cap
          )
          break
        case 'date-added':
          coins = coins.sort((after, before) => 
            Date.parse(before.date_added) - 
            Date.parse(after.date_added)
          )
          break
        default:
          coins = coins.sort((after, before) => 
            after.cmc_rank - before.cmc_rank
          )
      }

    coins = coins.slice(
      index % COIN_LIST_COUNT_PER_PAGE, 
      limit - index
    )
    // console.log(coins)
    coinsExt = coins.map((coin) =>
      pleaseAddCoinInformation(coin, currency))
  }

  else 
    coins = undefined

  return {coins: coinsExt ?? undefined, isLoading, count}
}


export function useNewCoins(limit: number =5) {
  const {coins: data, isLoading} = 
    useCoins({limit, sortBy: 'date-added'})

  const coins = React.useMemo(() => {
    if (!data) return data

    return data.map((coin) => {
      if (!coin.date_added) return coin
  
      const now = new Date().getTime()
      const ago = new Date(coin.date_added).getTime()
      const diff = Math.round(
        (now - ago) / A_DAY_IN_MILLISECONDS
      )
      const suffix = ['year', 'month', 'day']
      const daysOf = [365, 30, 1]
      const len = diff <= 0 ? 0 : suffix.length
      let passedTime = "just now"
  
      for (let i = 0; i < len; i++) {
        const diffIn = Math.floor(diff / daysOf[i])
  
        if (Math.max(diffIn, 0)) {
          passedTime = `${
            diffIn === 1 ? "a" 
            : diffIn
          } ${
            diffIn === 1 ? suffix[i] 
            : suffix[i] + "s"
          } ago`;
          break;
        }
      }
      return {...coin, passedTime}
  
    })
  }, [limit, isLoading])

  return {isLoading, coins}
}


export function useCoin(
  slug: string = '', currency: string= 'USD'
): [CryptoDetailed | undefined, boolean] {
  const { data: coin, isLoading } = useQuery(coinDetailQuery(
    slug, currency
  ))
  // console.log('useCoin.used', coin)

  return [
    coin ? pleaseAddCoinInformation(coin, currency) : undefined, 
    isLoading 
  ]
}


export function useHistorialData(
  symbol: string
): [HistoricalData | undefined, boolean] {
  const { data, isLoading } = useQuery(historicalDataQuery(symbol))
  return [ data, isLoading ] 
}


export function useFiatRates(
  symbols: Array<string> = ['USD','EUR','JPY','GBP','CNY','AUD','IDR']
): [{[x: string]: number} | undefined, boolean]
{
  const { data, isLoading } = useQuery(fiatRatesQuery())
  if (data && symbols.length) {
    const mapping: {[x: string]: number | never} = {}
    for (const symbol of symbols) {
      if (data[symbol]) mapping[symbol] = data[symbol]
    }
    return [mapping, isLoading]
  }
  return [ data, isLoading ] 
}


export function useFiatRate(symbol: string): 
  [number | undefined, boolean]
{
  const { data, isLoading } = useQuery(fiatRatesQuery())
  if (!data) return [ data, isLoading ]
  else return [data[symbol], isLoading]
}


export function useLatestNews(limit: number = 5): 
  [Array<NewsCard> | undefined, boolean] 
{
  const { data, isLoading } = useQuery(latestNewsQuery())
  if (data && limit > 0) {
    return [data.slice(0,limit), isLoading]
  }
  return [ data, isLoading ] 
}


export function useSparkData(
  symbol: string,
  range: number = 1
): [number[] | null, boolean] {
  const { data, isLoading } = useQuery(sparkDataQuery(symbol))
  if (!data?.close) return [null, isLoading]

  let spark = []
  const len = data.close.length ?? 0

  if (range >= 5 || range <= 0) 
    spark = data.close
  else 
    spark = data.close.slice(-(Math.ceil((len/5)*range)))

  return [ spark, isLoading ] 
}


export function useFiat(currency: string) {
  const { data } = useQuery(fiatMapQuery())
  return data?.[currency]
}


export function useCoinPrice(
  slug: string, currency: string= 'USD'
) {
  const [ coin, ] = useCoin(slug, currency)
  return coin?.price
}


function pleaseAddCoinInformation<T extends CryptoList>(
  coin: T, 
  currency= 'USD'
): T & CryptoWithLogo<T> & CryptoWithNumeric<T>
{
  return { 
    ...coin, 
    ...coin.quote[currency], 
    logo: 'logo' in coin ? coin.logo as string : getLogoById(coin.id)
  }
}


export function useWallets(
  onlyFiat: boolean = false
): [Array<WalletType> | undefined, boolean] 
{
  const { data, isLoading } = useQuery(walletListQuery())
  let wallets

  if (data && onlyFiat === true)
    wallets = data.filter((wallet) => 
      wallet.asset_is_fiat === true)

  else
    wallets = data

  // console.log('useWallets.used', wallets)
  return [ wallets, isLoading ]
}


export function useTransactions(
  slug: string = ''
): [Array<TransactionType> | undefined, boolean]
{
  const { 
    data, 
    isLoading 
  } = useQuery(transactionListQuery())

  let transactions = data

  if (data && slug)
    transactions = data.filter((item) => 
      item.asset_slug.indexOf(slug) === 0)

  return [ transactions, isLoading ]
}


export function useWallet(
  slug: string = 'USD'
): [WalletOrNotFound | undefined, boolean]
{
  const { data: wallet, isLoading } = useQuery(walletQuery(slug))
  // console.log('useWallet.used', slug, wallet)
  return [ wallet ?? undefined, isLoading ]
}


export const useFormOrder = () => {
  const { Form, data, formData } = useFetcher()
  const isSubmiting = formData != null

  // console.log('useFormOrder.used', {data})

  return { 
    Form, 
    isSubmiting, 
    ok: data?.ok ?? false,
    order: data?.order ?? {}, 
  }
}


export const useGlobalStatistic = (): [
  GlobalStatistic | undefined, boolean
] => {
  const { data, isLoading } = useQuery(coinGlobalStatisticQuery())
  return [data, isLoading]
}


export function useTransactionSparkData(): [number[], boolean]{
  const [transactionList, isLoading] = useTransactions()
  const A_HOUR_IN_MS = 1000 * 60 * 60
  const interval = 10 * A_HOUR_IN_MS
  const historicalData: number[] = []

  // console.log('useTransactionSparkData.used', transactionList)

  // const startTime = Date.parse(transactionList.at(-1)['timestamp'])
  // const endTime = Date.parse(transactionList.at(0)['timestamp'])

  if (!transactionList || !transactionList.length)
    return [historicalData, isLoading]

  const reversed = [...transactionList].reverse()
  const initial = {
    total: 0,
    trx: reversed[0]
  }

  reversed.reduce((acc, trx) => {
  let balance: number
  const price = acc.trx?.order_amount * acc.trx?.order_price

  if (acc.trx?.transaction_type == 'sell')
    balance = acc.total + price
  else
    balance = acc.total - price

  const limit = (
    Date.parse(trx?.timestamp) - Date.parse(acc.trx?.timestamp)
  ) / interval

  for (let i = 0; i <= limit; i++) {
    historicalData.push(balance)
  }

    return {total: balance, trx}
  }, initial)

  // console.log('useTransactionSparkData.used-2', historicalData)

  return [historicalData, isLoading]
}


export const useSearchInput = (onDoneTyping: (s: string) => void) => 
{
  const [value, setValue] = React.useState<string>('') 
  const keyword = useDebounce<string>(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // React.useEffect(() => {
  //   if (inputRef.current) inputRef.current.focus()
  // }, [])

  React.useEffect(() => {
    if (value === keyword) {
      onDoneTyping(keyword)
    }
  }, [value, keyword])

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
  }, [])

  return {inputRef, value, onChange}
}


export const useSearchProcessing = () => 
{
  const [search, setSearch] = React.useState('')
  const [isSearching, startTransition] = React.useTransition()
  const onSetSearch = React.useCallback((keyword: string) => {
    startTransition(() => {setSearch(keyword)})
  }, [])

  return {search, isSearching, onSetSearch}
}


export const useSortAssets = (headers: Array<SortableHeader>) => 
{
  const [sortBy, setSortBy] = React.useState<SortByOption>(null)
  const [isSorting, startTransition] = React.useTransition()

  const handleSort = (sortable: SortByOption) => {
    startTransition(() => {
      setSortBy(sortable)
    })
  }
  const headersWithHandleSort =
  React.useMemo(() => headers.map((header) => ({
    ...header,
    handleSort: header.sortable ? handleSort : undefined
  })), [])

  return {sortBy, isSorting, headersWithHandleSort}
}


export const usePagination = (
  limitPerPage = 25, 
  totalCount = 200
) => 
{
  const [isPending, startTransition] = React.useTransition()
  const [offset, setOffset] = React.useState({
    limit: limitPerPage,
    index: 0
  })

  const isLimitReached = offset.index + offset.limit >= totalCount
  const onNextPage = React.useCallback(() => {
    if (!isLimitReached)
      startTransition(() => {
        setOffset((curr) => ({
          ...curr,
          index: curr.index + limitPerPage
        }))
      })
  }, [totalCount])

  const onMoreItems = React.useCallback(() => {
    if (!isLimitReached)
      startTransition(() => {
        setOffset((curr) => ({
          ...curr,
          limit: curr.limit + limitPerPage
        }))
      })
    // console.log('onMoreItems.called', {isLimitReached, offset})
  }, [totalCount])

  const onPrevPage = React.useCallback(() => {
    if (offset.index > 0)
      startTransition(() => {
        setOffset((curr) => ({
          ...curr,
          index: Math.max(curr.index - limitPerPage, 0)
        }))
      })
  }, [])

  // console.log('usePagination.used', {offset, isLimitReached})
  return {offset, isPending, onNextPage, onPrevPage, onMoreItems}
}


export function useSessionTimeout(ms = 1000 * 60) {
  const submit = useSubmit()
  
  const handleTimeout = React.useCallback(() => {
    submit(null, { 
      method: "post", 
      action: "/signout" 
    })
  }, [])

  React.useEffect(() => {
    let timeoutId: number

    const handleEvent = throttle(() => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(handleTimeout, ms)
    }, 500)

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleEvent()
      }
    }

    timeoutId = window.setTimeout(handleTimeout, ms)

    window.addEventListener("mousemove", handleEvent)
    window.addEventListener("mousedown", handleEvent)
    window.addEventListener("resize", handleEvent)
    window.addEventListener("keydown", handleEvent)
    window.addEventListener("touchstart", handleEvent)
    window.addEventListener("wheel", handleEvent)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("mousemove", handleEvent)
      window.removeEventListener("mousedown", handleEvent)
      window.removeEventListener("resize", handleEvent)
      window.removeEventListener("keydown", handleEvent)
      window.removeEventListener("touchstart", handleEvent)
      window.removeEventListener("wheel", handleEvent)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.clearTimeout(timeoutId)
    }
  }, [ms])

  return handleTimeout
}


export function throttle(cb: () => void, ms: number) {
  let lastTime = 0
  return () => {
    const now = Date.now()
    if (now - lastTime >= ms) {
      cb()
      lastTime = now
    }
  }
}


export function useDebounce<T>(
  value: T, 
  delay: number= 500
): T 
{
  const [
    debouncedValue, 
    setDebouncedValue
  ] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}


export function useWindowSize() {
  const [size, setSize] = React.useState<{
    width: number | null
    height: number | null
  }>()

  React.useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return size
}


export function useIntersectionObserver<T extends Element>(options: Partial<{
  root?: Document | Element | null | undefined
  threshold?: number
  rootMargin?: string
}> = {}): [(node: T) => void, IntersectionObserverEntry | null]
{
  const { threshold = 1, root = null, rootMargin = "0px" } = options
  const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(null)

  const previousObserver = React.useRef<IntersectionObserver | null>(null)

  const customRef = React.useCallback(
    (node: T) => {
      if (previousObserver.current) {
        previousObserver.current.disconnect()
        previousObserver.current = null
      }

      if (node?.nodeType === Node.ELEMENT_NODE) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setEntry(entry)
          },
          { threshold, root, rootMargin }
        )

        observer.observe(node)
        previousObserver.current = observer
      }
    },
    [threshold, root, rootMargin]
  )

  return [customRef, entry]
}
