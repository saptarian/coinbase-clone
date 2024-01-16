import React from 'react'
import Skeleton from 'react-loading-skeleton'

import Button from '@/components/Button'
import { CoinListItem } from '../CoinList'
import { AngleRight } from '@/components/Icons'
import { WalletBalanceInfo } from './WalletBalanceInfo'
import SearchBox, { CoinSearcher } from '@/components/SearchBox'
import { useFiat, useWallet, useWallets, useWindowSize } from '@/lib/hooks'
import { FormOrderContext, OrderOptionsType } from './BuySellPanel'
import { CryptoListView, WalletType } from '@/types'


export const OrderPanel = ({
  context, orderType, updateOptions
}: {
  context: FormOrderContext
  orderType: 'buy' | 'sell'
  updateOptions: (v: React.SetStateAction<OrderOptionsType>) => void
}) => 
{
  const {
    Form, asset, wallet, currency, assetPrice, isSubmiting
  } = context
  const [amount, setAmount] = React.useState<number>(0)
  const {sign} = useFiat(currency || 'USD') ?? {sign: '~'}
  const caption = orderType === 'buy' ? "Buy" : "Sell"
  const [
    panelIndex, 
    setPanelIndex
  ] = React.useState(0)

  // console.log('OrderPanel.render', {asset, wallet})

  const updateAmount = (amount: string) => {
    const amountNum = parseFloat(amount)
    if (amountNum > 999999) return;
    setAmount(amountNum)
  }


  if (panelIndex > 0)
    return (
      <SearchBox onClose={() => setPanelIndex(0)}>
        {panelIndex === 1 ? 
          (({search, onClose: setOpen}) => (
            <CoinSearcher options={{search}}>
              {({coins, isLoading}) => (
                <ul className="h-[375px]">
                  {coins && !isLoading ? 
                    coins.map((coin) =>
                      <AssetListItem 
                        key={coin.slug}
                        coin={coin}
                        onSelect={() => { 
                          updateOptions(currentOptions => 
                            ({
                              ...currentOptions,
                              asset: coin.slug
                            })
                          )
                          setOpen(false)
                        }}
                      />
                    ) 
                  : Array.from({length:5}, (_,idx) => idx)
                    .map((val) => 
                      <AssetListItem 
                        key={val} 
                        isLoading={isLoading} 
                      />
                  )}
                </ul>
              )}
            </CoinSearcher>
          ))
        : (({search, onClose: setOpen}) => (
          <WalletList search={search}>
            {({wallets}) => (
              <ul className="h-[375px]">
                {wallets?.map((wallet) => (
                  <WalletListItem 
                    key={wallet.asset_slug}
                    slug={wallet.asset_slug}
                    onSelect={() => { 
                      updateOptions(currentOptions => 
                        ({
                          ...currentOptions,
                          wallet: wallet.asset_slug
                        })
                      )
                      setOpen(false)
                    }}
                  />
                ))}
              </ul>
            )}
          </WalletList>
        ))}
      </SearchBox>
    )


  return (
    <Form method="post" action='/preview'
      className="px-5 py-3 space-y-3">
      <OrderInputWrapper 
        amount={amount} 
        currencySign={sign}>
        <input 
          type="text"
          inputMode="numeric"
          name="total"
          onChange={(e) => updateAmount(e.target.value)}
          value={amount || 0}
          className="focus:border-none text-5xl text-blue-600
            caret-blue-600 focus:ring-0 w-full
            focus:outline-0 font-semibold border-none p-0"
        />
      </OrderInputWrapper>
      {orderType === 'buy' ? (
        <BuyFormOptions 
          list={[10,50,100]} 
          onSelectNum={(e) => {
            updateAmount(e.currentTarget.textContent ?? '10')
          }}
          currencySign={sign} 
          name="order_type" 
        />
      ) : asset && assetPrice ? (
        <SellFormOptions 
          name="order_type" 
          onSellAll={() => {
            setAmount(Math.floor(
              asset.balance * assetPrice
            ))
          }}
        />
      ) : ''}
      <div className="rounded-md border divide-y">
        <span onClick={() => setPanelIndex(1)}
          className="cursor-pointer">
          <OrderFormItem text={caption} 
            name="asset_symbol" asset={{
            name: asset?.asset_name,
            logo: asset?.asset_logo,
            symbol: asset?.asset_symbol
          }} />
        </span>
        <span onClick={() => setPanelIndex(2)}
          className="cursor-pointer">
          <OrderFormItem 
            text={orderType === 'buy' ? "Pay with" : "Add to"} 
            name="wallet_symbol" asset={{
            name: wallet?.asset_symbol 
              ? wallet.asset_symbol + ' Wallet' 
              : '',
            logo: wallet?.asset_logo,
            symbol: wallet?.asset_symbol
          }} />
        </span>
      </div>
      <div className="py-2">
        <Button 
          type="submit" 
          isLoading={isSubmiting}>Preview {caption}</Button>
      </div>
      <WalletBalanceInfo 
        assetPrice={assetPrice} 
        wallet={asset}
      />
    </Form>
  )
}


const AssetListItem = ({onSelect, coin, isLoading}: {
  onSelect?: () => void
  coin?: CryptoListView
  isLoading?: boolean
}) => 
{
  return (
    <li className={`${
      isLoading ? "" : "cursor-pointer hover:bg-slate-100/50"
    }`}
      onClick={onSelect}>
      <CoinListItem 
        coin={coin}
        isLoading={isLoading}
      />
    </li>
  )
}


const WalletListItem = ({slug, onSelect}: {
  slug: string
  onSelect: () => void
}) => 
{
  const [wallet,] = useWallet(slug)

  return (
    <li className="cursor-pointer py-2 px-3
      hover:bg-slate-100/50 w-full"
      onClick={onSelect}>
      <div className="flex gap-3 items-center w-full">
        <span className="w-5" >
        {wallet?.asset_logo ? (
          <img src={wallet.asset_logo} />
          ) : (
          <Skeleton circle height="30px"  /> 
        )}
        </span>
        <div className="w-full">
          {wallet?.asset_symbol ? (
            <h3 className="font-medium max-w-[7rem] truncate">
              {wallet?.asset_symbol} Wallet
            </h3>
            ) : <Skeleton />
          }
        </div>
      </div>
      <WalletBalanceInfo 
        wallet={wallet}
      />
    </li>
  )
}


const WalletList = ({search, children}: {
  search: string
  children: ({wallets, isLoading}: {
    wallets: Array<WalletType>
    isLoading: boolean
  }) => React.ReactNode
}) => 
{
  // eslint-disable-next-line prefer-const
  let [wallets, isLoading] = useWallets(true)

  // console.log('WalletList.render', wallets)

  if (search.length > 2 && wallets?.length)
    wallets = wallets.filter(wallet => 
      wallet.asset_name?.toLowerCase().includes(
        search.trim().toLowerCase()) ||
      wallet.asset_symbol?.toLowerCase().includes(
        search.trim().toLowerCase())
    )

  if (children === undefined)
    return (
      <pre>
        {isLoading ? 'Loading...' : 
          JSON.stringify(wallets, null, 2)}
      </pre>
    )

  if (typeof children === 'function' && wallets?.length)
    return children({wallets, isLoading})

  return 'only provide function as children'
}


const OrderInputWrapper = ({amount, children, currencySign}: {
  amount: number
  children: React.ReactNode
  currencySign: string
}) => 
{ 
  const [width, setWidth] = React.useState<number>(0)
  const ref = React.useRef<HTMLDivElement>(null)
  const size = useWindowSize()

  // console.log('OrderInputWrapper.render', size)

  React.useEffect(() => {
    if (ref.current)
      if (amount >= 10 )
        setWidth(Math.round(ref.current.clientWidth/2)+13+(
          13*(Math.floor(Math.log10(amount)))))
      else
        setWidth(Math.round(ref.current.clientWidth/2)+13)
  }, [amount, size])


  return (
    <div ref={ref} className="flex mt-6 mb-3 w-full">
      <span className={`grow ${
        width === 0 ? "text-center" : "text-right"
        } text-3xl text-blue-600 font-bold`}
      >{currencySign}
      </span>
      <span
        className={`${width === 0 ? "grow" : ""
        } transition-all duration-200 ease-in-out`}
        style={{width}}>
        {children}
      </span>
    </div>
  )
}


const SellFormOptions = ({onSellAll, name}: {
  onSellAll: () => void
  name: string
}) => (
  <>
    <input type="hidden" name={name} value="sell" />
    <ul className="flex gap-3">
      <li className="secondary-btn p-2 w-full"
        onClick={onSellAll}
      >Sell all</li>
    </ul>
  </>
)


const BuyFormOptions = ({list, onSelectNum, currencySign, name}: {
  list: Array<number>
  onSelectNum: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  currencySign: string
  name: string
}) => (
  <>
    <select name={name} id="buy" 
      className="secondary-btn-sm border-none text-center
      w-full">
      <option value="buy">
        One time purchase
      </option>
    </select>
    <ul className="flex gap-3 ">
      {list.map(val => (
        <li prefix={currencySign}
          className="secondary-btn-sm w-full
          before:content-[attr(prefix)]"
          key={val}
          onClick={onSelectNum}
        >{val}</li>
      ))}
    </ul>
  </>
)


type OrderFormItemType = {
  text: string
  name: string
  asset: Partial<{
    name: string
    logo: string
    symbol: string
  }>
}

const OrderFormItem: React.FC<OrderFormItemType> = ({
  text, name, asset = {}
}) => 
{
  // console.log('OrderFormItem.render', name, asset)


  return (
    <div className="grid grid-cols-10 gap-3 items-center
      hover:bg-gray-100 p-3 w-full cursor-pointer">
      <small className="col-span-3 text-gray-400 font-medium text-sm
        text-left whitespace-nowrap text-clip overflow-hidden">
        {text}
      </small>
      <div className="flex items-center gap-1.5 grow col-span-6">
        <span className="w-4">
          {asset.logo ? <img src={asset.logo} /> : <Skeleton circle />}
        </span>
        <span className="text-sm font-medium text-gray-500
          truncate w-24 text-left">{asset.name || <Skeleton />}
        </span>
        {asset.symbol ? (
          <input type="hidden" name={name} value={asset.symbol} />
        ) : ''}
      </div>
      <AngleRight className="w-2 h-2 text-gray-800" />
    </div>
  )
}
