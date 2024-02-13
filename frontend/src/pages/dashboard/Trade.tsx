import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useNavigate, useOutletContext } from 'react-router-dom'

import { 
  useCoins, 
  useSortAssets,
  usePagination, 
  useSearchInput, 
  useSearchProcessing, 
  useIntersectionObserver, 
} from '@/lib/hooks'
import { PriceDisplay, DecimalDisplay, StyledNumericDisplay } from '@/components/Numeric'
import { CryptoListView, SortableHeader } from '@/types'
import { DashboardContextType } from '@/lib/context'
import TableTemplate from '@/components/TableTemplate' 
import TransactionList from './components/TransactionList'
import BuySellPanel from './components/BuySellPanel'
import NewCoinList from './components/NewCoinList'
import { SearchLoop } from '@/components/Icons'
import Spinner from '@/components/Spinner'
import Modal from '@/components/Modal'


export function Trade() {
  const {identity} = useOutletContext<DashboardContextType>() 
  const isUserVerified = identity?.verified
  const [buyAsset, setBuyAsset] = React.useState({
    isOpen: false,
    assetSlug: 'bitcoin',
  })

  const handleBuy = React.useCallback((assetSlug: string) => {
    setBuyAsset({isOpen: true, assetSlug})
  }, [])

  // console.log('Trade.render')


  return (
    <main className="max-w-screen-xl grow md:px-5 md:py-3 
      flex gap-3 flex-col lg:flex-row mx-auto w-full">
      <MainContentMemo onClickBuy={handleBuy} />
      <AddtionalContent
        isUserVerified={isUserVerified} 
      />
      <Modal className="w-[320px] bg-white shadow
        rounded-sm mx-auto mt-12 max-md:hidden"
        onClose={() => setBuyAsset({
          ...buyAsset, isOpen: false
        })}
        toggle={buyAsset.isOpen}>
        {({open, setOpen}) => open ? (
          <BuySellPanel 
            onDone={() => setOpen(false)}
            assetSlug={buyAsset.assetSlug}
            isUserVerified={isUserVerified}
          />
        ) : ''}
      </Modal>
    </main>
  )
}


const MainContentMemo = React.memo<{
  onClickBuy: (s: string) => void
}>(function MainContent({onClickBuy})
{
  const {isSearching, onSetSearch, search} = useSearchProcessing()
  const [range, setRange] = React.useState(1)
  // console.log('MainContent.render', search)

  return (
    <div className="grow">
      <section className="md:container-section divide-y relative">
        <div className="flex justify-between gap-3 px-5 py-5 item-center">
          <SearchInput
            onDoneTyping={onSetSearch}
          />
          <span className="my-auto">
            <select name="range" id="range" 
              className="bg-gray-200/75 py-3 pl-4 pr-8 
              rounded-full font-medium text-sm border-0
              hover:bg-gray-200 cursor-pointer"
              onChange={(e) => {
                setRange(parseInt(e.target.value))
              }}
            >
              <option value="1"> 1D </option>
              <option value="5"> 5D </option>
            </select>
          </span>
        </div>
        {isSearching ? (
          <div className="py-2 absolute top-[100px] left-[70px] 
            z-20 border-none">
            <Spinner 
              style={{borderLeftColor:"blue"}} 
            />
          </div>
        ) : ''}
        {/*Searching: {search.length > 2 ? search : ''}*/}
        <TableMemo 
          range={range}
          search={search.length > 2 ? search : ''}
          onClickBuy={onClickBuy}
        />
      </section>
    </div>
  )
})


const AddtionalContent = 
React.memo(function addtionalContent({isUserVerified}: {
  isUserVerified?: boolean
}) 
{
  // console.log('AddtionalContent.render')

  return (
    <div className="flex gap-3 lg:flex-col lg:shrink-0
      lg:w-[280px] flex-col md:flex-row max-lg:hidden">
      <section className="md:container-section">
        <BuySellPanel 
          isUserVerified={isUserVerified}
        />
      </section>

      <section className="w-full">
        <div className="md:container-section">
          <h2 className="px-5 py-3 font-medium md:border-b">
            New on Coinbase
          </h2>
          <NewCoinList />
        </div>
      </section>

      <section className="w-full">
        <div className="md:container-section divide-y">
          <h2 className="px-5 py-3 font-medium">
            Recent Transactions
          </h2>
          <TransactionList limit={5} variant="simple" />
        </div>
      </section>

    </div>
  )
})


const SearchInput = ({onDoneTyping}: {
  onDoneTyping: (s: string) => void
}) => 
{
  const {inputRef, onChange, value} = useSearchInput(onDoneTyping)

  return (
    <div className="relative w-full md:w-96">
      <span className="absolute px-5 z-10 top-5">
        <SearchLoop />
      </span>
      <input 
        ref={inputRef}
        type="search"
        value={value}
        placeholder='Search all assets'
        onChange={onChange}
        className={`rounded-full border pl-12 pr-6 h-14 w-full`}
      />
    </div>
  )
}


const tableCoinHeaders: Array<SortableHeader> = [
  { id: 'name', label: 'Name', width: '40%' },
  { id: 'price', label: 'Price', sortable: 'price', width: '6rem' },
  { id: 'change', label: 'Change', sortable: 'change', width: '4.5rem' },
  { id: 'market-cap', label: 'Market cap', sortable: 'market-cap', width: '6rem' },
  { id: 'buy', label: '', width: '4.5rem' },
]


const TableMemo = React.memo(function Table({
  search, onClickBuy, range, tableLimitPerPage=25
}: {
  range: number
  search: string
  tableLimitPerPage?: number
  onClickBuy: (s: string) => void
})
{
  const {pref: {currency}} = useOutletContext<DashboardContextType>()
  const {sortBy, isSorting,
    headersWithHandleSort, } = useSortAssets(tableCoinHeaders)
  const [totalCount, setTotalCount] = React.useState(tableLimitPerPage)
  const {isPending, onMoreItems,
    offset: {limit, index}, } = usePagination(tableLimitPerPage, totalCount)
  const {coins, count,
    isLoading, } = useCoins({limit, index, search, sortBy, currency })

  React.useEffect(() => {
    if (!isLoading) setTotalCount(count || tableLimitPerPage)
  }, [count, isLoading, search])

  const [ref, entry] = useIntersectionObserver<HTMLTableRowElement>({
    threshold: 0.5, rootMargin: "10px"
  })

  React.useEffect(() => {
    if (entry?.isIntersecting) onMoreItems()
  }, [entry])


  return (
    <TableTemplate
      className="first:pl-3 first:md:pl-5 last:pr-3 last:md:pr-5
      last:max-md:hidden [&:nth-child(4)]:max-md:text-right"
      headers={headersWithHandleSort}>
      {isSorting || !coins ?
        Array.from({length:7}).map((_,idx) => (
        <CoinListRow key={idx}
          isLoading={isLoading || isSorting}
        />
      )) : coins.map((coin) => (
        <CoinListRow key={coin.slug}
          range={range}
          ref={ref}
          onClickBuy={onClickBuy}
          coin={coin}
        />
      ))}
      {isPending || isLoading ? (
        Array.from({length:3}).map((_,idx) => (
          <CoinListRow key={idx}
            isLoading={true}
          />
        ))
      ) : ''}
    </TableTemplate>
  )
})


const CoinListRow = React.forwardRef<HTMLTableRowElement, {
  isLoading?: boolean
  coin?: Partial<CryptoListView>
  onClickBuy?: (s: string) => void
  range?: number
}>(({ isLoading, coin={}, onClickBuy, range}, ref ) => 
{
  const navigate = useNavigate()
  const changePercent = range === 1
    ? coin.percent_change_24h 
    : coin.percent_change_7d

  return (
    <SkeletonTheme enableAnimation={isLoading}>
      <tr onClick={() => {
          if (!isLoading && coin.slug)
            navigate('/price/' + coin.slug)
        }} ref={ref} title={coin.name}
        className={`hover:bg-slate-100/50 cursor-pointer
          ${coin.slug ? "" : "pointer-events-none"}`}
      >
        <td className="flex items-center gap-3 py-4 
          md:pl-5 pl-3 mr-3">
          <span className="w-8 flex-none" >
            {coin.logo ? (
              <img src={coin.logo} />
            ) : (
              <Skeleton circle height={30} width={30} />
            )}
          </span>
          <div className="overflow-hidden grow">
            <p className="font-medium truncate">
              { coin.name || <Skeleton /> }
            </p>
            <p className="text-gray-500">
              { coin.symbol || <Skeleton /> }
            </p>
          </div>
        </td>
        <td className="pr-3">
          <p className="truncate">{coin.price ? (
              <PriceDisplay price={ coin.price } />
            ) : (
              <Skeleton />
            )}
          </p>
        </td>
        <td className="pr-3">
          <p className="truncate">
            {changePercent ? (
              <StyledNumericDisplay
                valueWithSign={changePercent} >
                <DecimalDisplay value={changePercent} />
              </StyledNumericDisplay>
            ) : (
              <Skeleton />
            )}
          </p>
        </td>
        <td className="pr-3 max-md:text-right">
          <p className="truncate">{coin.market_cap ? (
              <PriceDisplay price={ coin.market_cap } />
            ) : (
              <Skeleton />
            )}
          </p>
        </td>
        <td className="pr-5 max-md:hidden text-center">
          {coin.price && onClickBuy ? (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                if (coin.slug?.length)
                  onClickBuy(coin.slug)
              }}
              className="primary-btn-sm w-full">
              Buy
            </button>
          ) : ''}
        </td>
      </tr>
    </SkeletonTheme>
  )
})
