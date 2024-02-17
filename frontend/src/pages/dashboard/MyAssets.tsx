import Skeleton from 'react-loading-skeleton'
import React from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'

import { PriceDisplay, DecimalDisplay } from '@/components/Numeric'
import TableTemplate from '@/components/TableTemplate' 
import TransactionList from './components/TransactionList'
import { useWallets, useWallet, useCoinPrice } from '@/lib/hooks'
import { DashboardContextType } from '@/lib/context'
import { WalletType } from '@/types'


const myCashHeaders = [
  { id: 'name', label: 'Name', width: '60%' },
  { id: 'balance', label: 'Total balance' },
]

const myCryptoHeaders = [
  { id: 'name', label: 'Name', width: '60%' },
  { id: 'balance', label: 'Crypto Balance' },
]


export function MyAssets() 
{
  const { pref } = useOutletContext<DashboardContextType>()
  const [walletList, isLoading] = useWallets()
  const [cryptoPrices, setCryptoPrices] = React.useState<{
    [x: string]: number
  } | null>(null)
  const [length, setLength] = React.useState({
    wallets: 0,
    cryptoWallets: 0
  })
  // console.log('MyAssets.render', {cryptoPrices, walletList})

  const {fiatBalance, wallets, cryptoWallets} = React.useMemo(() => {
    let fiatBalance = 0
    const cryptoWallets: Array<WalletType> = []
    const wallets: Array<WalletType> = []

    // from array wallet split fiat and crypto
    if (walletList) {
      walletList.forEach(wallet => {
        if (wallet.asset_is_fiat === true) {
          wallets.push(wallet)
          fiatBalance += wallet.balance
        }
        else {
          cryptoWallets.push(wallet)
        }
      })
      setLength({
        wallets: wallets.length, 
        cryptoWallets: cryptoWallets.length
      })
    }
    // console.log('walletList.memo', {
    //   fiatBalance, wallets, cryptoWallets
    // })
    return {fiatBalance, wallets, cryptoWallets}
  }, [walletList])


  const cryptoBalance = React.useMemo(() => {
    let balance = 0
    if (cryptoPrices)
      balance = Object.values(cryptoPrices).reduce(
        (a,v) => a+v
      , 0)

    // console.log('cryptoPrices.memo', {balance})
    return balance
  }, [cryptoPrices])

  // console.log('MyAssets.render', cryptoBalance)


  return (
    <main className="md:px-5 md:py-5 space-y-3 md:bg-slate-100
      max-w-screen-xl mx-auto grow w-full">
      <div className="flex gap-3 flex-col lg:flex-row">
        <div className="md:space-y-3 grow">
          <section className="md:container-section">
            <div className="px-5 py-3 border-b">
              {isLoading ? 
                <Skeleton width="4rem" count={2} />
              :
                <CashInfo 
                  value={fiatBalance}
                  title="My cash"
                />
              }
            </div>
            {!wallets.length && !isLoading ? (
              <NoCryptoWallet />
            ) : (
              <TableTemplate
                className="first:pl-5 py-3"
                headers={myCashHeaders}>
                {isLoading ? Array.from({
                  length: length.wallets
                }, (_,idx) => (
                  <tr key={idx}>
                    <td className="p-5"> 
                      <Skeleton width="6rem" /> 
                    </td>
                    <td className="py-5"> 
                      <Skeleton width="10rem" /> 
                    </td>
                  </tr>
                )) : wallets.map((wallet) => (
                  <MyCashBodyTable 
                    key={wallet.asset_slug}
                    wallet={wallet}
                  />
                ))}
              </TableTemplate>
            )}
          </section>
          <section className="md:container-section
            max-md:border-y">
            <div className="px-5 py-3 border-b">
              {isLoading || (!cryptoBalance && cryptoWallets.length) ? 
                <Skeleton width="4rem" count={2} 
                  enableAnimation={isLoading} />
              :
                <CashInfo 
                  value={cryptoBalance}
                  title="My crypto"
                />
              }
            </div>
            {!cryptoWallets.length && !isLoading ? (
              <NoCryptoWallet />
            ) : (
              <TableTemplate
                className="first:pl-5 py-3"
                headers={myCryptoHeaders}>
                {isLoading ? Array.from({
                  length: length.cryptoWallets
                }, (_,idx) => (
                  <tr key={idx}>
                    <td className="p-5"> 
                      <Skeleton width="6rem" /> 
                    </td>
                    <td className="py-5"> 
                      <Skeleton width="10rem" /> 
                    </td>
                  </tr>
                )) : cryptoWallets.map((wallet) => (
                  <CryptoWalletItem 
                    key={wallet.asset_slug}
                    data={wallet}
                    slug={wallet.asset_slug}
                    balance={wallet.balance}
                    currency={pref.currency}
                    setCryptoPrices={setCryptoPrices}
                  />
                ))}
              </TableTemplate>
            )}
          </section>
        </div>
        <div className="lg:w-[350px] shrink-0">
          <section className="md:container-section divide-y">
            <h2 className="px-5 py-3 font-medium">
              Recent Transactions
            </h2>
            <TransactionList limit={5} variant="simple" />
          </section>
        </div>
      </div>
    </main>
  )
}


const CashInfo = ({
  title, value
}: {
  title?: string
  value: number | string
}) => 
{
  // console.log('CashInfo.render', value)
  return (
    <>
      {title ? (
        <h3 className="text-gray-500 font-medium leading-5">
          {title}
        </h3>
      ) : ''}
      <span className="text-lg font-medium">
        <PriceDisplay 
          price={value} 
        />
      </span>
    </>
  )
}


const NoCryptoWallet = () => 
{
  return (
    <div className="w-fit py-12 px-5 mx-auto text-center">
      <span className="mb-2">
        <img src="" />
      </span>
      <h4 className="font-medium text-xl">
        Get started with crypto
      </h4>
      <p className="text-gray-700 mt-1 mb-4">
        Your crypto assets will appear here.
      </p>
      <Link to="/trade" className="secondary-btn-sm">
        Explore assets
      </Link>
    </div>
  )
}


type CryptoWalletItemProps = {
  data: WalletType
  setCryptoPrices: (
    v: React.SetStateAction<{[K in string]: number} | null>
  ) => void
  currency: string
  balance: number
  slug: string
}

const CryptoWalletItem: React.FC<CryptoWalletItemProps> = ({
  data, setCryptoPrices, currency, balance, slug
}) => 
{
  const cryptoPrices = useCoinPrice(slug, currency)
  // console.log('CryptoWalletItem.render', 
  //   {balance, slug, currency, cryptoPrices}
  // )

  React.useEffect(() => {
    if (cryptoPrices) {
      setCryptoPrices((currentObj) => 
        ({...currentObj, [slug]: cryptoPrices * balance})
      )
      // console.log('CryptoWalletItem.effect', data)
    }
  }, [balance, slug, currency, cryptoPrices])


  return (
    <MyCryptoBodyTable wallet={data} />
  )
}


const WalletLogo = ({slug}: {slug: string}) => 
{
  const [wallet,isLoading] = useWallet(slug)

  if (isLoading) 
    return <Skeleton circle width="16px" height="16px" />

  return wallet?.asset_logo 
    ? <img src={wallet.asset_logo} />
    : <div className="w-2 h-2 bg-stone-100 rounded-full"></div>
}


const MyCryptoBodyTable = ({wallet={}}: {
  wallet: Partial<WalletType>
}) =>
{
  const navigate = useNavigate()

  return (
    <tr 
      onClick={() => {
        if (wallet.asset_slug)
          navigate('/accounts/' + wallet.asset_slug)
      }} 
      className="hover:bg-slate-100/50 cursor-pointer"
    >
      <td className="flex items-center gap-3 py-5 pl-5">
        <span className="w-4" >
          {wallet.asset_slug ? (
            <WalletLogo slug={wallet.asset_slug} />
          ) : ''}
        </span>
        <p className="font-medium">
          {wallet.asset_name}
        </p>
      </td>
      <td>
        <p>
          {wallet.balance != null ? (
            <>
              <DecimalDisplay 
                value={wallet.balance} 
                decPlaces={8} 
              /> 
              <span className="pl-1.5 font-medium text-gray-500">
                {wallet.asset_symbol}
              </span>
            </>
          ) : ''}
        </p>
      </td>
    </tr>
  )
}


const MyCashBodyTable = ({wallet={}}: {
  wallet: Partial<WalletType>
}) =>
{
  const navigate = useNavigate()

  return (
    <tr 
      onClick={() => {
        if (wallet.asset_slug)
          navigate('/accounts/' + wallet.asset_slug)
      }} 
      className="hover:bg-slate-100/50 cursor-pointer"
    >
      <td className="flex items-center gap-3 py-5 pl-5">
        <span className="w-4" >
          {wallet.asset_slug ? (
            <WalletLogo slug={wallet.asset_slug} />
          ) : ''}
        </span>
        <p className="font-medium">
          { wallet.asset_name }
        </p>
      </td>
      <td>
        <p>{wallet.balance != null ? (
            <PriceDisplay price={ wallet.balance } />
          ) : ''}
        </p>
      </td>
    </tr>
  )
}
