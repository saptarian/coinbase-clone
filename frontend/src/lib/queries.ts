import toast from 'react-hot-toast'
import { formatDecimal, formatCurrency } from './helper'
import { QueryClient, QueryCache } from '@tanstack/react-query'
import { 
  getFiat,
  getIdMap,
  getQuote,
  getMetadata,
  getSparkData,
  getFiatRates,
  getLatestNews,
  getListCrypto,
  fetchUserWallets, 
  getHistoricalData,
  getGlobalStatistic,
  fetchUserTransactions, 
 } from '@/lib/server'
import { 
  CoinMap, 
  FiatMap, 
  MetaData,
  SparkData,
  StatsList,
  WalletType,
  CryptoList,
  FiatObject,
  QuoteWithMeta,
  HistoricalData,
  WalletNotFound,
  GlobalStatistic,
  TransactionType,
  WalletOrNotFound,
  FetchedCryptoList,
  NewsCard,
} from '@/types'

const A_MINUTE_IN_MS = 1000 * 60
const A_HOUR_IN_MS = A_MINUTE_IN_MS * 60
const A_DAY_IN_MS = A_HOUR_IN_MS * 24
// const A_MINUTE_IN_SEC = 60


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: A_DAY_IN_MS,
      staleTime: A_MINUTE_IN_MS * 5,
      retry: 0,
      networkMode: 'offlineFirst',
    },
  },
  queryCache: new QueryCache({
    onError: async (error, query) => {
      if (query.state.data)
        queryClient.setQueryData(query.queryKey, query.state.data)

      else {
        queryClient.invalidateQueries(query.queryKey)
        await queryClient.cancelQueries({ queryKey: query.queryKey })
      }

      if (query.state.data !== undefined && error instanceof Error) {
        toast(error.message, {id: 'query'})
      }
    }
  })
})


export const coinListQuery = (page: number = 1) => ({
  queryKey: ['coin', 'list', page],
  queryFn: (): Promise<FetchedCryptoList> => 
    getListCrypto({page: page.toString()})
    .then((resp) => resp.data)
})


export const coinListSearchQuery = (search: string) => ({
  queryKey: ['coin', 'list', 'search', search],
  queryFn: (): Promise<FetchedCryptoList> => 
    getListCrypto({search}).then((resp) => resp.data),
  staleTime: A_DAY_IN_MS
})


export const coinMapSlugBundleQuery = (page: number = 1) => ({
  queryKey: ['coin', 'map', 'bundle', 'slug', page],
  queryFn: (): Promise<{[s: string]: string}> => 
    getIdMap({page: page.toString(), bundle: 'slug'}).then(
      (resp) => resp.data
    ),
  staleTime: A_DAY_IN_MS
})


export const fiatMapQuery = () => ({
  queryKey: ['fiat', 'map'],
  queryFn: (): Promise<FiatObject> => 
    getFiat().then((resp) => resp.data),
  staleTime: A_DAY_IN_MS,
})


export const coinMetadataQuery = (id: number) => ({
  queryKey: ['coin', 'meta', id],
  queryFn: async (): Promise<MetaData> => {
    const coinMetadata = await getMetadata({id: id.toString()}).then(
      (resp) => resp.data
    ).catch((err) => {throw err})

    delete coinMetadata.tags
    delete coinMetadata["tag-names"]
    delete coinMetadata["tag-groups"]
    return coinMetadata
  },
  staleTime: A_DAY_IN_MS,
})


export const coinGlobalStatisticQuery = () => ({
  queryKey: ['coin', 'global', 'statistic'],
  queryFn: (): Promise<GlobalStatistic> => 
    getGlobalStatistic().then((resp) => resp.data),
  staleTime: A_DAY_IN_MS,
})


export const coinMapItemQuery = (id: number) => ({
  queryKey: ['coin', 'map', id],
  queryFn: (): Promise<CoinMap> => 
    getIdMap({id: id.toString()}).then((resp) => resp.data),
  staleTime: A_DAY_IN_MS,
})


export const coinDetailQuery = (
  slug: string, 
  currency: string = 'USD'
) => 
({
  queryKey: ['coin', 'detail', slug],
  queryFn: async (): Promise<QuoteWithMeta & StatsList | null> => 
  {
    if (!slug) return null

    const id = await getIDBySlug(slug)
    const symbol = slug.length === 3 ? slug : null

    if (!id) {
      if (symbol && await isFiat(symbol))
        return null

      throw { 
        message: `Coin detail ${slug} not found`, 
        status: 404 
      }
    }

    const quote: QuoteWithMeta = await getQuote({id: id.toString()}).then(
      (resp) => resp.data
    ).catch((err) => {
      throw err
    })
    const coinDetail = injectStats(quote, currency)
    delete coinDetail.tags
    return coinDetail
  },
})


export const historicalDataQuery = (symbol: string, years: number = 4) =>
({
  queryKey: ['historical', symbol],
  queryFn: (): Promise<HistoricalData> => 
    getHistoricalData(symbol, years).then((resp) => resp.data),
  staleTime: A_DAY_IN_MS,
})


export const latestNewsQuery = (limit: number = 5) =>
({
  queryKey: ['news', 'latest'],
  queryFn: (): Promise<Array<NewsCard>> => 
    getLatestNews(limit).then((resp) => resp.data),
  staleTime: A_DAY_IN_MS,
})


export const fiatRatesQuery = () =>
({
  queryKey: ['fiat', 'rates'],
  queryFn: (): Promise<{[x: string]: number}> => 
    getFiatRates().then((resp) => resp.data),
})


export const sparkDataQuery = (symbol: string) =>
({
  queryKey: ['spark', symbol],
  queryFn: async (): Promise<SparkData> => {
    const data = await getSparkData(symbol)
    .then((d) => d.data)
    if (data && data.close && data.close.length) {
      const dataSliced = []
      const numSkipped = 36
      for (let i =0; i < data.close.length; i+=numSkipped) {
        dataSliced.push(data.close[i])
      }
      return {close: dataSliced, len: data.len}
    }

    return data
  },
  staleTime: 15 * A_MINUTE_IN_MS,
})


export const transactionListQuery = () => ({
  queryKey: ['transaction', 'all'],
  queryFn: (): Promise<Array<TransactionType>> => 
    fetchUserTransactions().then((resp) => resp.data),
  staleTime: A_DAY_IN_MS,
})


export const walletListQuery = () => ({
  queryKey: ['wallet', 'list'],
  queryFn: async () => {
    let wallets = await getWallets('')

    if (wallets?.length)
      wallets = wallets.map((wallet) => {
        if (wallet.asset_is_fiat)
          return {...wallet, asset_slug: wallet.asset_symbol}

        return wallet
      })

    return wallets
  },
  staleTime: A_DAY_IN_MS,
})


export const walletQuery = (
  slug: string, 
  currency: string = "USD"
) => 
({
  queryKey: ['wallet', 'detail', slug],
  queryFn: async (): Promise<WalletOrNotFound | null> => 
  {

    if (!slug)
      return null

    const symbol = slug.length === 3 ? slug : undefined

    // try get wallet by symbol from 'wallet list query'
    const walletFromList = await findWalletFromList({symbol, slug})

    let walletData: WalletType | undefined
    let assetFromCoinMap: CoinMap | undefined
    let assetFromFiatMap: FiatMap | undefined
    let walletNotFound: WalletNotFound | null = null
    let coin: QuoteWithMeta | null = null

    // perhaps wallet exist on our database
    // perhaps the default one e.g. USD wallet
    // so try fetch by symbol from our server 
    if (walletFromList?.asset_symbol) {
      walletData = await getWallets(walletFromList.asset_symbol)

      if (walletData && walletData.asset_is_fiat)
        Object.assign(walletData, {
          asset_slug: walletData.asset_symbol
        })

      // if symbol exist, means wallet exist in our database
      // and probably wallet asset is fiat /currency type
      // so try find from map that already created and fetched
      // from 3rd party server, find by symbol, much faster
      if (walletFromList.asset_is_fiat) {
        assetFromFiatMap = await getFiatBySymbol(
          walletFromList.asset_symbol
        )
        Object.assign(walletFromList, {
          asset_slug: assetFromFiatMap?.symbol
        })
        // console.log(walletFromList, assetFromFiatMap)
      }
    }

    if (walletFromList?.asset_is_fiat === false) {
      const id = await getIDBySlug(slug)
      if (id) 
        assetFromCoinMap = await getCoinMapItem(id)
    }

    // no wallet found from list means nothing in our DB
    // then set placeholder value 
    // with coin value from 'coin detail query'
    if (walletFromList === undefined) {
      coin = await getCoinDetailBySlug(slug, currency)

      if (coin)
        walletNotFound = {
          balance: 0,
          asset_logo: coin.id ? getLogoById(coin.id) : logoPlaceholder,
          asset_name: coin.name,
          asset_symbol: coin.symbol,
        }
    }

    let walletDetail: WalletOrNotFound

    if (walletNotFound)
      walletDetail = walletNotFound

    else if (walletFromList)
      walletDetail = walletData ?? walletFromList

    else
      return null

    const assetFromMap = assetFromCoinMap ?? assetFromFiatMap
    walletDetail.cmc_asset_id = assetFromMap?.id ?? coin?.id
    walletDetail.cmc_asset_slug = assetFromCoinMap?.slug ?? coin?.slug
    walletDetail.asset_logo = 
      assetFromMap?.id 
      ? getLogoById(assetFromMap.id) 
      : coin?.id 
        ? getLogoById(coin.id) 
        : logoPlaceholder

    // if (walletFromList?.asset_is_fiat === false) {
    //   coin = await getCoinDetailBySlug(slug, currency)
    //   walletDetail.asset_price = coin?.quote?.[currency]?.price
    // }

    // console.log('walletQuery.queried', walletDetail)

    return walletDetail
  },
  staleTime: A_DAY_IN_MS,
})


const getCoinMapItem = async (id: number) => {
  const query = coinMapItemQuery(id)
  return await queryClient.ensureQueryData(
    query.queryKey, query.queryFn
  )
}


const findWalletFromList = async ({symbol, slug}: {
  symbol: string | undefined, 
  slug: string | undefined
}) => 
{
  const query = walletListQuery()
  const wallets = await queryClient.ensureQueryData(
    query.queryKey, query.queryFn
  )

  if (slug)
    return wallets?.find(({asset_slug}) => 
      asset_slug === slug)

  else if (symbol)
    return wallets?.find(({asset_symbol}) => 
      asset_symbol === symbol)

  return undefined
}


const getCoinDetailBySlug = async (
  slug: string, 
  currency: string
) => 
{
  const query = coinDetailQuery(slug, currency)
  return await queryClient.ensureQueryData(
    query.queryKey, query.queryFn
  )
}


const getFiatBySymbol = async (symbol: string) => {
  const query = fiatMapQuery()
  const fiatMap = await queryClient.ensureQueryData(
    query.queryKey, query.queryFn
  )
  return fiatMap?.[symbol]
}


export const isFiat = async (slug: string) => {
  if (slug.length !== 3) return false
  return Boolean(await getFiatBySymbol(slug))
}


const TOTAL_IDMAP_PER_PAGE = 5000

const getTotalPages = async () => {
  const query = coinGlobalStatisticQuery()
  const data = await queryClient.ensureQueryData(
    query.queryKey, query.queryFn
  )
  const total = data?.['active_cryptocurrencies']
  if (total)
    return Math.ceil(total / TOTAL_IDMAP_PER_PAGE)
  else 
    return 1
}


const getIDBySlug = async (slug: string) => {
  const totalPages = await getTotalPages()
  for (let page = 1; page <= totalPages; page++) {
    const query = coinMapSlugBundleQuery(page)
    const data = await queryClient.ensureQueryData(
      query.queryKey, query.queryFn
    )
    // console.log('getIDBySlug', {page, totalPages, data})
    if (data && data[slug])
      return parseInt(data[slug])
  }
  return null
}


// type FindByCriteria = {
//   id: number
//   slug: string
//   symbol: string
// }

// const findAssetFromMapList = 
// async <T extends (CoinMap | FiatMap) & {
//   slug?: string
// }>(
//   queryKey: Array<string | number | symbol>, 
//   queryFn: () => Promise<Array<T>>,
//   options: Partial<FindByCriteria>
// ): Promise<undefined | T> => 
// {
//   const {id, slug, symbol} = options
//   const mapData = await queryClient.ensureQueryData(queryKey, queryFn)

//   if (!mapData.length)
//     return undefined

//   else if (id != undefined)
//     return mapData.find((asset) => asset.id == id)

//   else if (symbol != undefined)
//     return mapData.find((asset) => asset.symbol === symbol)

//   else if (slug != undefined && mapData[0].slug) {
//     return mapData.find((asset) => asset.slug === slug)
//   }

//   return undefined
// }


type WalletOrWallets<T extends string | ''> = 
T extends '' 
? Array<WalletType>
: WalletType


const getWallets = <T extends string | ''>(
  symbol: T
): Promise<WalletOrWallets<T>> => fetchUserWallets(symbol).then(
  (resp) => resp.data
)


// const baseURL = "http://localhost:8080"

// async function getHistoricalData(
//   symbol: string
// ): Promise<HistoricalData>
// {
//   const resp = await api.get(
//     `/${symbol ?? 'BTC'}-USD.json`, 
//     {baseURL}
//   )
//   return resp?.data
// }


// async function fetchCryptoList(): Promise<Array<CryptoList>> {
//   const resp = await api.get('/list-crypto-200.json', {baseURL})
//   return resp?.data?.data
// }


// async function fetchCrypto(id: number): Promise<QuotesAsset> {
//   const resp = await api.get('/quotes-100.json', {baseURL})
//   return resp?.data?.data[id]
// }


// async function fetchCoinMap(): Promise<Array<CoinMap>> {
//   const resp = await api.get('/cmc-id-map.json', {baseURL})
//   return resp?.data?.data
// }


// async function fetchFiatMap(): Promise<Array<FiatMap>> {
//   const resp = await api.get('/fiat-map.json', {baseURL})
//   return resp?.data?.data
// }


// async function fetchMetaData(id: number): Promise<MetaData> {
//   const resp = await api.get('/metadata-100.json', {baseURL})
//   return resp?.data?.data[id]
// }


function injectStats<T extends CryptoList>(
  data: T,
  currency: string = "USD"
): T & StatsList 
{
  const { 
    quote,
    cmc_rank,
    max_supply,
    circulating_supply, 
  } = data
  const percent_cs = formatDecimal(circulating_supply / max_supply * 100)

  return {
    ...data,
    stats: [
      { 
        title: "Market cap", 
        sub: formatCurrency(quote?.[currency]?.market_cap), 
      },
      { 
        title: "Volume (24h)",
        sub: formatCurrency(quote?.[currency]?.volume_24h),
        spanTitle: formatDecimal(quote?.[currency]?.percent_change_24h) + '%',
      },
      { 
        title: "Circulating supply",
        sub: formatCurrency(circulating_supply),
        spanTitle: isNaN(percent_cs) ? 'Infinity total supply' : `${percent_cs}% of total supply`
      },
      // { title: "Typical hold time", sub: "158 days" },
      // { 
      //   title: "Trading activity",
      //   sub: "99% buy",
      //   spanTitle: "",
      //   spanSub: "1% sell",
      // },
      { title: "Popularity", sub: "#" + cmc_rank },
    ]
  }
}


const logoPlaceholder = 'https://placehold.co/64x64/gold/FFF?text=$'
const LOGO_BASE_URL = import.meta.env.VITE_LOGO_BASE_URL ?? 'http://localhost:8081/cmc_logo'

export const getLogoById = (id: number) => `${LOGO_BASE_URL}/${id}.png`
