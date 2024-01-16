import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useNavigate, useOutletContext } from 'react-router-dom'

import { useCoins, useDebounce, useIntersectionObserver } from '@/lib/hooks'
import { PriceDisplay, DecimalDisplay, StyledNumericDisplay } from '@/components/Numeric'
import { CoinQueryOptions, CryptoListView, SortByOption } from '@/types'
import { DashboardContextType } from '@/lib/context'
import TableTemplate, { SortableHeader } from '@/components/TableTemplate' 
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


const MainContentMemo = 
React.memo<{
  onClickBuy: (s: string) => void
}>(function MainContent({onClickBuy})
{
  const [search, setSearch] = React.useState('')
  const [isSearching, startTransition] = React.useTransition()
  const handleSearch = React.useCallback((keyword: string) => {
    startTransition(() => {
      setSearch(keyword)
    })
  }, [])

  // console.log('MainContent.render', search)


  return (
    <div className="grow">
      <section className="md:container-section divide-y relative">
        <SearchInput
          onDoneTyping={handleSearch}
        />
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
}) => {
  const [
    keyword, 
    setKeyword
  ] = React.useState<string | null>(null)
  const search = useDebounce<string>(keyword ?? '')
  const searchRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (searchRef.current)
      searchRef.current.focus()
  }, [])

  // console.log('SearchInput.render', keyword, search)

  React.useEffect(() => {
    if (keyword === search) onDoneTyping(search)
  }, [keyword, search])


  return (
    <div className="flex gap-3 px-5 py-5 justify-between">
      <div className="relative w-full md:w-96">
        <span className="absolute px-5 z-10 top-5">
          <SearchLoop />
        </span>
        <input 
          ref={searchRef}
          type="search"
          value={keyword ?? ''}
          placeholder='Search all assets'
          onChange={(e) => setKeyword(e.target.value)}
          className={`rounded-full border pl-12 pr-6 h-14 w-full`}
        />
      </div>
    </div>
  )
}


const tableCoinHeaders: Array<SortableHeader> = [
  { id: 'name', label: 'Name', width: '40%' },
  { id: 'price', label: 'Price', sortable: 'price', width: '5em' },
  { id: 'change', label: 'Change', sortable: 'change', width: '3.5em' },
  { id: 'market-cap', label: 'Market cap', sortable: 'market-cap', width: '4.5em' },
  { id: 'buy', label: '', width: '4em' },
]


const TableMemo = 
React.memo(function Table({search, onClickBuy}: {
  search: string
  onClickBuy: (s: string) => void
})
{
  const {pref} = useOutletContext<DashboardContextType>()
  const {currency} = pref
  const [sortBy, setSortBy] = React.useState<SortByOption>(null)
  const [limit, setLimit] = React.useState<number>(25)
  const options = React.useMemo<CoinQueryOptions>(() => ({
    limit, search, currency, sortBy
  }), [limit, search, currency, sortBy])
  const {coins, isLoading, count} = useCoins(options)
  const [ref, entry] = useIntersectionObserver<HTMLTableRowElement>({
    threshold: 0.5, rootMargin: "10px"
  })
  const [isSorting, startTransition] = React.useTransition()
  const [isPending, startNextPage] = React.useTransition()

  const coinsTotalCount = count ?? coins?.length
  const isLimitReached = limit >= coinsTotalCount

  const handleSort = (sortable: SortByOption) => {
    startTransition(() => {
      setSortBy(sortable)
    })
  }

  const tableCoinHeadersWithHandleSort =
    React.useMemo(() => tableCoinHeaders.map((header) => ({
      ...header,
      handleSort: header.sortable ? handleSort : undefined
    })), [])

  // console.log('Table.render', entry, limit)

  React.useEffect(() => {
    if (entry?.isIntersecting && !isLimitReached) {
      startNextPage(() => {
        setLimit((limit) => limit+25)
      })
    }
  }, [entry, isLimitReached])


  return (
    <TableTemplate
      className="first:pl-5 last:pr-5 last:max-md:hidden"
      headers={tableCoinHeadersWithHandleSort}>
      {isSorting || !coins ?
        Array.from({length:7}).map((_,idx) => (
        <CoinListRow key={idx}
          isLoading={isLoading || isSorting}
        />
      )) : coins.map((coin) => (
        <CoinListRow key={coin.slug}
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
}>(({ isLoading, coin={}, onClickBuy }, ref ) => 
{
  const navigate = useNavigate()

  return (
    <SkeletonTheme enableAnimation={isLoading}>
      <tr onClick={() => {
          if (!isLoading && coin.slug)
            navigate('/price/' + coin.slug)
        }} ref={ref} title={coin.name}
        className={`hover:bg-slate-100/50 cursor-pointer
          ${coin.slug ? "" : "pointer-events-none"}`}
      >
        <td className="flex items-center gap-3 py-4 pl-5 mr-3">
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
            {coin.percent_change_24h ? (
              <StyledNumericDisplay
                valueWithSign={coin.percent_change_24h} >
                <DecimalDisplay value={coin.percent_change_24h} />
              </StyledNumericDisplay>
            ) : (
              <Skeleton />
            )}
          </p>
        </td>
        <td className="pr-5 md:pr-3">
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
