import { AxiosResponse } from "axios"

export interface ModAxiosResponse extends AxiosResponse {
  message: string
}


export type BasicResponseJSON = {
  message: string
  msg: string
}


export type FetchState = {
  data: ModAxiosResponse | null
  error: ModAxiosResponse | null
  status: string
}


export type AuthItem = {
  token: string
}


export type User = {
  first_name: string
  last_name: string
  display_name: string
  email: string
  public_id: string
  email_verified: boolean
  photo_url: string | null
}


export type SigninValues = {
  email: string
  password: string
}


export type FullName = Pick<User, 'first_name' | 'last_name'>
export type SignupValues = SigninValues & FullName


export type Preference = {
  timezone: string
  currency: string
}


export type PhoneNumber = {
  number: string
  verified: boolean
  created_at: string
  is_primary: boolean
}


export type Address = {
  street: string
  unit?: string
  city: string
  country: string
  postal_code: number
}


export type Identity = {
  verified?: boolean
  date_of_birth: string
}


export type UserData = {
  user: User
  address: Address
  identity: Identity
  preference: Preference
  phone_numbers: Array<PhoneNumber>
  avatar?: string
}


export type BodySetupIdentity = {
  address: {[P in keyof Address]: string}
  identity: {[P in keyof Identity]: string}
  analytic: {[K in string]: string}
}


export interface UserDataRequired extends
Omit<UserData, 'preference' | 'phone_numbers'> {
  pref: Preference
  phones: Array<PhoneNumber>
}


export type AssetModel = {
  id: number
  slug: string
  name: string
  symbol: string
  is_fiat: boolean
  is_Active: boolean
  logo: string
  price: number
}

export type SmallAssetDisplay = Pick<AssetModel, 
'name' | 'logo' | 'slug' | 'symbol'>

export type WalletOfAsset = {
  [P in keyof AssetModel as `asset_${P}`]: AssetModel[P]
}

export type WalletCMC = {
  cmc_asset_id: number
  cmc_asset_slug: string
}

export interface WalletType extends WalletOfAsset, Partial<WalletCMC> {
  balance: number
  inactive: boolean
}

export type WalletNotFound = Pick<WalletType, 
'balance' | 'asset_logo' | 'asset_name' | 'asset_symbol'>

export type WalletOrNotFound = Partial<WalletType> & WalletNotFound


export type OrderModel = {
  uuid: string
  asset_id: number
  wallet_id: number
  order_type: string
  amount: number
  price: number
  status: string
  timestamp: string
}


export type TransactionModel = {
  order_uuid: string
  timestamp: string
  transaction_type: string
}


export interface FormOrderType extends TransactionModel, OrderModel {
  total: number
  wallet_symbol: string
  asset_symbol: string
}

type PickyAsset = Pick<AssetModel, 'is_fiat' | 'name' | 'slug' | 'symbol'>
type PickyOrder = Pick<OrderModel, 'amount' | 'price' | 'status'>

type AssetTransaction = {
  [P in keyof PickyAsset as `asset_${P}`]: PickyAsset[P]
}

type WalletTransaction = {
  [P in keyof PickyAsset as `wallet_${P}`]: PickyAsset[P]
}

type OrderTransaction = {
  [P in keyof PickyOrder as `order_${P}`]: PickyOrder[P]
}

export interface TransactionType extends 
AssetTransaction, WalletTransaction , OrderTransaction {
  timestamp: string
  transaction_type: string
}


export type SortByOption = 
'default' | 'rank' | 'price' | 'change' | 
'market-cap' | 'date-added' | null | undefined


export type CoinQueryOptions = Partial<{
  index: number
  limit: number
  search: string
  sortBy: SortByOption
  currency: string
}>

export type BaseAsset = {
  id: number
  name: string
  symbol: string  
}

export interface FiatMap extends BaseAsset {
  sign: string
}

export type FiatObject = {
  [K in string]: FiatMap
}

export interface CoinMap extends BaseAsset {
  rank: number
  slug: string
  is_active: boolean | 0 | 1
}

export interface ExtendedAsset extends BaseAsset {
  slug: string
  date_added: string
  infinite_supply: boolean
  tags?: Array<string>
}

export interface CryptoList extends ExtendedAsset {
  max_supply: number
  circulating_supply: number
  total_supply: number
  cmc_rank: number
  quote: NestedQuote
}

export type FetchedCryptoList = {
  status: {
    timestamp: string
    error_code: number
    error_message: string | null
    elapsed: number
    credit_count: number
    notice: string | null
    total_count: number
  }
  data: CryptoList[]
}

export interface MetaData extends ExtendedAsset {
  category: string
  description: string
  logo: string
  subreddit: string
  "tag-names"?: Array<string>
  "tag-groups"?: Array<string>
  urls: NestedURLs
}

export type QuotesAsset = CryptoList & {
  tags?: Array<Tags> | Array<string>
  is_active: number
  is_fiat: number
}

type NestedQuote = {
  [K in string]: QuoteNumeric
}

type NestedURLs = {
  [K in string]: Array<string | undefined>
}

export type CryptoWithLogo<T extends CryptoList> = T & Pick<MetaData, 'logo'>
export type CryptoWithNumeric<T extends CryptoList> = T & QuoteNumeric
export type CryptoWithStatList<T extends CryptoList> = T & StatsList
export type CryptoListView = 
  CryptoList & 
  CryptoWithLogo<CryptoList> & 
  CryptoWithNumeric<CryptoList>

export type CryptoListViewWithPassTime = CryptoListView & {
  passedTime?: string
}
  
export type QuoteWithMeta = QuotesAsset & MetaData
export type CryptoDetailed = QuoteWithMeta & QuoteNumeric & StatsList
export type UniversalAssetType = {
  [s: string]: unknown
  quote: NestedQuote
  tags: Array<Tags | string | undefined>
  'tags-names': Tags | Array<string | undefined>
  'tags-groups': Tags | Array<string | undefined>
  urls: NestedURLs
}

type Tags = {
  slug: string
  name: string
  category: string
}

export type AssetStats = {
  title: string
  sub: string
  spanTitle?: string
  spanSub?: string
}

export type StatsList = {
  stats: Array<AssetStats>
}

export type QuoteNumeric = {
  price: number
  volume_24h: number
  volume_change_24h: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  percent_change_30d: number
  percent_change_60d: number
  percent_change_90d: number
  market_cap: number
  market_cap_dominance: number
  fully_diluted_market_cap: number
  last_updated: string
}


export type HistoricalData = {
  date: Array<string>
  'adj-close': Array<number>
  volume: Array<number>
}


export type SparkData = {
  'close': Array<number>
  len: number
}


export type GlobalStatistic = {
  active_cryptocurrencies: number
  quote: {[s: string]: {[s: string]: number}}
  [s: string]: unknown 
}

// export type BuySellProps = {
//   Form
//   isSubmiting: boolean
//   wallet:
//   asset:
//   order:
//   orderType: 'buy' | 'sell'
// }
