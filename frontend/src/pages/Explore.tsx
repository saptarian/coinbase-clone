import React from 'react'
import { Link } from 'react-router-dom'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { 
  useCoins, 
  useNewCoins, 
  useFiatRates,
  useSparkData,
  usePagination,
  useSearchInput,
  useGlobalStatistic, 
  useSearchProcessing,
} from '@/lib/hooks'
import SimpleChart from '@/components/SimpleChart'
import { CryptoListView, CryptoListViewWithPassTime, SortableHeader } from '@/types'
import { 
  PriceDisplay,
  DecimalDisplay, 
  StyledNumericDisplay, 
} from '@/components/Numeric'
import { NewsCard } from '@/components/LatestNews'
import TableTemplate from '@/components/TableTemplate'
import { SearchLoop } from '@/components/Icons'


export function Explore() 
{
  const [globalStats,] = useGlobalStatistic()
  const marketChange = 
    globalStats?.quote.USD?.total_market_cap_yesterday_percentage_change
  const totalAssets = globalStats?.active_cryptocurrencies
  const {search, onSetSearch, isSearching} = useSearchProcessing()


  return (
    <main className="max-w-screen-xl mx-auto ring-1 
      ring-slate-200 pt-4 divide-y">
      <section className="flex flex-col gap-1 px-5 mb-1
        md:max-w-xl md:items-center mx-auto md:py-12">
        <h1 className="text-2xl font-medium md:text-4xl
          md:font-normal py-1"> 
          Explore the cryptoeconomy
        </h1>
        {marketChange ? ( 
          <p className="text-slate-500">
            Market is {
              marketChange.toString()[0] === '-' ? 'down' : 'stable'
            } <StyledNumericDisplay suffix="%"
                valueWithSign={marketChange}>
              <DecimalDisplay value={marketChange} />
            </StyledNumericDisplay> (24h)
          </p>
        ) : ''}
        <SearchField onDoneTyping={onSetSearch} />
      </section>
      {/*<hr className="max-md:hidden" />*/}
      <section className="lg:flex flex-row divide-x">
        
        <div className="grow divide-y">
          <TableAssetWithSearchAndPagination
            totalAssets={totalAssets}
            search={search}
            isSearching={isSearching}
          />
          <BottomSection />
        </div>

        <aside className="lg:w-[380px] shrink-0 flex flex-col">
          <NewCoins />
          {/*<ExploreAssets coins={coins} title='Trending'/>*/}
          <div className="p-3">
            <h2 className="font-medium text-xl px-4 py-2 mt-3 ">
              Latest Crypto News
            </h2>
            <NewsCard />
          </div>
        </aside>
        {/*<div className="md:hidden ">
          {[
            'Biggest Gainers', 
            'New on Coinbase',
            'Trending',
            'Free Crypto'
          ].map((t) => (
            <ExploreAssetsMobile key={t} title={t} />
          ))}
        </div>*/}

      </section>
    </main>
  )
}


const TableOptions = ({onSelCurrency, onSelRange}: {
  onSelCurrency: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onSelRange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) => {
  const [rates,] = useFiatRates()

  return (
    <div className="flex gap-2">
      <select name="currency" id="currency" 
        className="bg-slate-100 py-2 pl-4 pr-8
        rounded-full font-medium text-sm border-0"
        defaultValue="USD"
        onChange={(onSelCurrency)}
      >
        {rates ? Object.keys(rates).map(c => (
          <option key={c} value={c}> {c} </option>
        )) : 
          <option value='USD'>USD</option>
        }
      </select>
      <select name="range" id="range" 
        className="bg-slate-100 py-2 pl-4 pr-8
        rounded-full font-medium text-sm border-0"
        onChange={onSelRange}
      >
        <option value="1"> 1D </option>
        <option value="5"> 5D </option>
      </select>
    </div>
  )
}


const NewCoins = () => {
  const {coins} = useNewCoins(3)
  // console.log('NewCoins.render')

  return (
    <div className=" border-b pb-1">
      <ExploreAssets coins={coins} title='New on Coinbase'/>
    </div>
  )
}


const SearchField = React.memo<{
  onDoneTyping: (s: string) => void
}>(function SearchInput({onDoneTyping})
{
  const {onChange, inputRef, value} = useSearchInput(onDoneTyping)

  return (
    <div className="relative w-full">
      <span className="absolute px-5 z-10 md:top-7 top-5">
        <SearchLoop />
      </span>
      <input 
        type="search" 
        placeholder="Search for an asset" 
        className="ring-1 ring-gray-500 h-10 pl-12 pr-10 rounded-full
        my-2 w-full md:h-14 hover:bg-slate-100/50 md:text-xl"
        ref={inputRef}
        value={value}
        onChange={onChange}
      />
    </div>
  )
})


const tableAssetHeaders: Array<SortableHeader> = [
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price', sortable: 'price', width: '7rem' },
  { id: 'chart', label: '', width: '6rem' },
  { id: 'change', label: 'Change', sortable: 'change', width: '4rem' },
  { id: 'market-cap', label: 'Market cap', sortable: 'market-cap', width: '6rem' },
  { id: 'trade', label: '', width: '6rem' },
]


type TableOptionsType = {
  range: number
  currency: string
}


const TableOptionsContext = 
  React.createContext<TableOptionsType>({
    range: 1, currency: 'USD'
  })
const TableAssetWithSearchAndPagination = ({
  tableLimitPerPage = 20, 
  search = '',
  isSearching = false,
  totalAssets = 0
}) => 
{
  // const {search} = useSearchProcessing()
  // const {sortBy, headersWithHandleSort} = useSortAssets(tableAssetHeaders)
  const [totalCount, setTotalCount] = React.useState(tableLimitPerPage)
  const {offset: {limit, index}, onMoreItems, isPending} = 
    usePagination(tableLimitPerPage, totalCount)
  const {coins, isLoading, count} = useCoins({limit, index, search})

  React.useEffect(() => {
    if (!isLoading) setTotalCount(count || tableLimitPerPage)
  }, [count, isLoading, search])

  // console.log('TableAssetWithSearchAndPagination.render', {search})

  const [range, setRange] = React.useState(1)
  const [currency, setCurrency] = React.useState('USD')


  return (
    <>
      {/*<SearchFieldMemo onDoneTyping={onSetSearch} />*/}
      <div className="flex items-center px-6 py-4 font-medium">
        <div className="grow mb-2 flex flex-col 
          sm:flex-row items-baseline">
          <h2 className="md:text-2xl text-lg pr-1.5">
            Crypto prices
          </h2>
          <small className="text-gray-500">
            {totalAssets ? `${totalAssets} assets` : ''}
          </small>
        </div>
        <TableOptions 
          onSelRange={(e) => {
            setRange(parseInt(e.target.value))
          }}
          onSelCurrency={(e) => {
            setCurrency(e.target.value)
          }}
        />
      </div>
      {/*<ul className="px-6 mb-4 hidden md:block flex gap-2">
        {[
          'All assets',
          'Tradable',
          'Gainers',
          'Losers'
        ].map((name) => (
          <CategoryItem name={name} key={name} />
        ))}
      </ul>*/}
      <TableOptionsContext.Provider value={{range, currency}}>
        <AssetCollectionMemo 
          coins={coins} 
          headers={tableAssetHeaders} 
          isLoading={isLoading}
          isSearching={isSearching}
          isPending={isPending}
        />
      </TableOptionsContext.Provider>
      <div className="px-5 py-3">
        <button 
          onClick={onMoreItems}
          className="secondary-btn-sm w-full">
          More
        </button>
      </div>
    </>
  )
}


const AssetCollectionMemo = React.memo<{
  coins?: CryptoListView[]
  headers: SortableHeader[]
  isLoading: boolean
  isSearching: boolean
  isPending: boolean
}>(function AssetCollection({
  coins, 
  headers, 
  isLoading, 
  isPending, 
  isSearching
})
{
  // console.log('AssetCollection.render')

  return (
    <>
      <ul className="md:hidden">
        {isSearching ? (
          <TableItemMobile />
        ) : ''}
        {coins ? coins.map(
          (coin) => <TableItemMobile 
            key={coin.slug} 
            coin={coin}
            isLoading={isLoading}
          />
        ) : Array.from({length:7}).map((_,idx) => (
          <TableItemMobile key={idx}/>
        ))}
        {isPending ? Array.from({length:3}).map((_,idx) => (
          <TableItemMobile key={idx}/>
        )) : ''}
      </ul>
      <div className="max-md:hidden overflow-x-hidden">
        <TableTemplate
          className="first:pl-5 last:pr-5 text-center 
          first:text-left [&:nth-child(2)]:text-right py-3"
          headers={headers}
          divider={false}
        >
          {isSearching ? (
            <TableRowItem isLoading />
          ) : ''}
          {!coins || isLoading ? 
            Array.from({length:7}).map((_,idx) => (
            <TableRowItem key={idx} isLoading />
          )) : 
            coins.map((coin) => (
            <TableRowItem 
              key={coin.slug} 
              coin={coin} 
              isLoading={isLoading}
            />
          ))}
            {isPending ? Array.from({length:3}).map((_,idx) => (
            <TableRowItem key={idx} isLoading />
          )) : ''}
        </TableTemplate>
      </div>
    </>
  )
})


const TableRowItem = ({coin={}, isLoading}: {
  coin?: Partial<CryptoListView>
  isLoading?: boolean
}) => 
{
  const {range, currency} = React.useContext(TableOptionsContext)
  const [rates,] = useFiatRates()
  const priceMultiplier = rates?.[currency] ?? 1

  const changePercent = range === 1 ?
    coin.percent_change_24h : coin.percent_change_7d

  return (
    <SkeletonTheme enableAnimation={isLoading}>
      <tr className="hover:bg-slate-100/50">
        <td className="flex items-center gap-3 flex-grow
          pl-5 pr-1.5 py-2.5 text-left">
          <span className="bg-slate-200 w-8 h-8
            flex items-center rounded-full shrink-0">
            {coin.logo ? (
              <span className="w-fit mx-auto
                overflow-hidden rounded-full">
                <img src={coin.logo} width="20px"/>
              </span>
            ) : ''}
          </span>
          <div>
            <h3 className="font-medium">
              {coin.name || <Skeleton width="5rem" />}
            </h3>
            <span className="text-gray-500 ">
              {coin.symbol || <Skeleton width="3rem" />}
            </span>
          </div>
        </td>
        <td className="text-right px-1.5 py-2.5">
          {coin.price ? (
            <PriceDisplay 
              price={coin.price * priceMultiplier} 
              currency={currency}
            />
          ) : isLoading ? <Skeleton /> : '~'}
        </td>
        <td className="pl-3 pr-2 py-2.5">
          {coin.symbol ? (
            <MiniSparkLine 
              range={range}
              symbol={coin.symbol} 
              height={100}
            />
          ) : <Skeleton />}
        </td>
        <td className="pl-2 pr-3 py-2.5">
          {changePercent ? (
            <StyledNumericDisplay 
              valueWithSign={changePercent}>
              <DecimalDisplay value={changePercent} />
            </StyledNumericDisplay>
          ) : isLoading ? <Skeleton /> : '~'}
        </td>
        <td className="px-1.5 py-2.5 text-center">
          {coin.market_cap ? (
            <PriceDisplay 
              price={coin.market_cap * priceMultiplier} 
              currency={currency}
            />
          ) : isLoading ? <Skeleton /> : '~'}
        </td>
        <td className="pl-1.5 pr-5 py-2.5">
          {coin.slug ? (
            <Link to={`/price/${coin.slug}`} 
              className="primary-btn-sm"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              Trade
            </Link>
          ) : ''}
        </td>
      </tr>
    </SkeletonTheme>
  )
}


const MiniSparkLine = ({symbol, height, range=1}: {
  symbol: string
  height?: number
  range?: number
}) => {
  const [spark,isLoading] = useSparkData(symbol, range)

  if (isLoading)
    return <Skeleton height="2rem" />

  return <SimpleChart 
    height={height} 
    data={
      spark && spark.length > 1 
      ? spark 
      : Array(2).fill(0)
    } 
  />
}


const TableItemMobile = ({coin={}, isLoading}: {
  coin?: Partial<CryptoListView>
  isLoading?: boolean
}) => 
{
  const {range, currency} = React.useContext(TableOptionsContext)
  const [rates,] = useFiatRates()
  const priceMultiplier = rates?.[currency] ?? 1

  const changePercent = range === 1 ?
    coin.percent_change_24h : coin.percent_change_7d

  return (
    <li>
      <Link 
        to={coin.slug ? `/price/${coin.slug}` : '.'}
        className={`flex items-center px-5 py-3 gap-3 ${
          coin.slug ? "hover:bg-slate-100/50" 
          : "pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 grow">
          <span className="bg-slate-200 w-8 h-8
            flex items-center rounded-full shrink-0">
            {coin.logo ? (
              <span className="w-fit mx-auto
                overflow-hidden rounded-full">
                <img src={coin.logo} width="20px"/>
              </span>
            ) : ''}
          </span>
          <div>
            <h3 className="font-medium">
              {coin.name || <Skeleton />}
            </h3>
            <span className="text-gray-500">
              {coin.symbol || <Skeleton />}
            </span>
          </div>
        </div>
        <span className="w-20">
          {coin.symbol ? (
            <MiniSparkLine 
              range={range}
              symbol={coin.symbol} 
              height={100}
            />
          ) : <Skeleton width="5rem" />}
        </span>
        <div className="text-right">
          <p>
            {coin.price ? (
              <PriceDisplay 
                price={coin.price * priceMultiplier} 
                currency={currency} 
              />
            ) : isLoading ? <Skeleton width="6rem" /> : '~' }
          </p>
          <small>
            {changePercent ? (
              <StyledNumericDisplay 
                valueWithSign={changePercent}
              >
                <DecimalDisplay 
                  value={changePercent} 
                />
              </StyledNumericDisplay>
            ) : isLoading ?  <Skeleton width="3rem" /> : '~'}
          </small>
        </div>
      </Link>
    </li>
  )
}


// const CategoryItem = ({name}: {
//   name: string
// }) => {
//   return (
//     <li>
//       <Link to="/" className="bg-slate-100 p-1 pr-2
//         font-medium text-sm rounded-md flex items-center
//         gap-1 active:text-blue-600 active:bg-slate-100/50">
//         <span className="w-7 h-7 rounded-md
//           bg-blue-600"></span>
//         <span>{name}</span>
//       </Link>
//     </li>
//   )
// }


// const ExploreAssetsMobile = ({title, coin={}}: {
//   title: string
//   coin?: Partial<CryptoListView>
// }) => {
//   return (
//     <div>
//       <Link to="/" className="flex hover:bg-slate-100/40 gap-4
//         items-center px-5 py-3">
//         <span className="bg-slate-200 w-8 h-8
//           flex items-center rounded-full shrink-0">
//           {coin.logo ? (
//             <span className="w-fit mx-auto
//               overflow-hidden rounded-full">
//               <img src={coin.logo} width="20px"/>
//             </span>
//           ) : ''}
//         </span>
//         <div>
//           <h2 className="font-medium ">{title}</h2>
//           <p className="text-slate-500">
//             {coin?.name}<span 
//               className="text-green-500"
//             > {coin?.percent_change_24h} </span> price change
//           </p>
//         </div>
//       </Link>
//     </div>
//   )
// }


const ExploreAssets = ({title, coins}: {
  title: string
  coins?: CryptoListView[]
}) => {
  return (
    <div className="flex flex-col gap-2 p-3">
      <h2 className="font-medium text-xl px-4 py-2 mt-3 ">
        {title}
      </h2>
      <ul>
        {coins ? coins.map((coin) => (
          <ExploreAssetsItem 
            key={coin.slug}
            coin={coin}
          />
        )) : 
          Array.from({length: 7}).map((_,idx) => (
            <ExploreAssetsItem key={idx} />
        ))}
      </ul>
    </div>
  )
}


const ExploreAssetsItem = ({coin = {}}: {
  coin?: Partial<CryptoListViewWithPassTime>
}) => 
{
  return (
    <li>
      <Link to={coin.slug ? `/price/${coin.slug}` : '.'}
        className={`flex items-center gap-3 justify-between ${
          coin.slug ? "cursor-pointer hover:bg-slate-100/50" 
          : "pointer-events-none"
        } py-2 px-4 rounded-lg`}
      >
        <div className="flex items-center gap-3 grow">
          <span className="bg-slate-200 w-8 h-8
            flex items-center rounded-full shrink-0">
            {coin.logo ? (
              <span className="w-fit mx-auto
                overflow-hidden rounded-full">
                <img src={coin.logo} width="20px"/>
              </span>
            ) : ''}
          </span>
          <div>
            <h2 className="font-medium">
              {coin.name || <Skeleton width="7rem"/>} 
            </h2>
            <p className="text-gray-500"> 
              {coin.symbol || <Skeleton width="3rem"/>} 
            </p>
          </div>
        </div>
        <p className="text-gray-500 text-right">
          {coin.passedTime
            ? `Added ${coin.passedTime}`
            : <Skeleton width="5rem" />
          }
        </p>
      </Link>
    </li>
  )
}


const BottomSection = () => (
  <div className="text-sm text-gray-500 leading-4 p-10">
    Certain content has been prepared by third 
    parties not affiliated with Coinbase Inc. 
    or any of its affiliates and Coinbase is 
    not responsible for such content. Coinbase 
    is not liable for any errors or delays in 
    content, or for any actions taken in reliance 
    on any content. Information is provided for 
    informational purposes only and is not investment 
    advice. This is not a recommendation to buy or 
    sell a particular digital asset or to employ a 
    particular investment strategy. Coinbase makes 
    no representation on the accuracy, suitability, 
    or validity of any information provided or for 
    a particular asset. Prices shown are for 
    illustrative purposes only. Actual cryptocurrency 
    prices and associated stats may vary. Data 
    presented may reflect assets traded on Coinbase’s 
    exchange and select other cryptocurrency exchanges.
  </div>
)
