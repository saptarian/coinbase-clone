import React from 'react'
import { ArrowLeft } from '@/components/Icons'
import { useDebounce, useCoins } from '@/lib/hooks'
import { CoinQueryOptions, CryptoListView } from '@/types'


type ClickToClose = (
  v: boolean | React.MouseEvent<HTMLSpanElement, MouseEvent>
) => void
type SearchBoxProps = {
  children: React.ReactNode | ((o: {
    search: string
    onClose: ClickToClose
  }) => React.ReactNode)
  onClose: ClickToClose
}


const SearchBox: React.FC<SearchBoxProps> = ({
  onClose, children
}) => 
{
  const [keyword, setKeyword] = React.useState<string>('')
  const debouncedKeyword = useDebounce<string>(keyword)
  const searchRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (searchRef.current) {
      // console.log('SearchBox.useEffect')
      searchRef.current.focus()
    }
  }, [])


  return (
    <div className="divide-y">
      <div className="py-3 px-3 flex gap-1 items-center">
        <span className="p-2 cursor-pointer 
          hover:text-blue-600"
          onClick={onClose}>
          <ArrowLeft className="w-5" />
        </span>
        <input 
          ref={searchRef}
          type="search" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search for an asset'
          className="rounded-full border px-6 py-1.5 w-full"
        />
      </div>
      <div className="overflow-y-auto">
        {children ? typeof children === 'function' ? 
          children({search: debouncedKeyword, onClose}) : children
        : ''}
      </div>
    </div>
  )
}


type CoinSearcherProps = {
  children: (x: {
    coins?: Array<CryptoListView>
    isLoading: boolean
  }) => React.ReactNode
  options: CoinQueryOptions
}

export const CoinSearcher: React.FC<CoinSearcherProps> = (
  {options, children}
) => 
{
  const {coins, isLoading} = useCoins(options)

  if (children === undefined)
    return (
      <pre>
        {isLoading ? 'Loading...' : 
          JSON.stringify(coins, null, 2)}
      </pre>
    )

  if (typeof children === 'function')
    return children({coins, isLoading})

  return 'only provide function as children'
}


export default SearchBox
