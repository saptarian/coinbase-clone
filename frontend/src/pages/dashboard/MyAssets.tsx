import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import React from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'

import { PriceDisplay } from '@/components/Numeric'
import TableTemplate from '@/components/TableTemplate' 
import TransactionList from './components/TransactionList'
import { useWallets, useWallet, useCoinPrice } from '@/lib/hooks'
import { DashboardContextType } from '@/lib/context'
import { WalletType } from '@/types'


const myCashHeaders = [
  { id: 'name', label: 'Name', width: '35%' },
  { id: 'balance', label: 'Total balance', width: '8em' },
  { id: '_', label: '', width: '3em' },
]


const myCryptoHeaders = [
  { id: 'name', label: 'Name', width: '35%' },
  { id: 'balance', label: 'Crypto Balance', width: '8em' },
  { id: '_', label: '', width: '3em' },
]


export function MyAssets() {
  const { pref } = useOutletContext<DashboardContextType>()
  const [walletList, isLoading] = useWallets()
  const [
    cryptoPrice, 
    setCryptoPrice
  ] = React.useState<{[K in string]: number} | null>(null)
  
  // console.log('MyAssets.render', cryptoPrice, walletList)

  const cryptoWallets: Array<WalletType> = []
  const wallets: Array<WalletType> = []
  let fiatBalance = 0
  

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
  }

  const cryptoBalance = React.useMemo(() => {
    let balance = 0

    if (cryptoPrice)
      balance = Object.values(
        cryptoPrice).reduce((a,v) => a+v, 0)
    
    return balance
  }, [cryptoPrice])


  return (
    <main className="md:px-5 md:py-5 space-y-3 md:bg-slate-100
      max-w-screen-xl mx-auto grow w-full">
      <div className="flex gap-3 flex-col lg:flex-row">
        <div className="md:space-y-3 grow">
          <section className="md:container-section">
            <div className="px-5 py-3 border-b">
              <CashInfo 
                value={fiatBalance}
                title="My cash"
              />
            </div>
            {wallets.length > 0 ? (
              <TableTemplate
                className="first:pl-5 last:pr-5 py-3"
                headers={myCashHeaders}>
                {wallets.map((wallet) => (
                  <MyCashBodyTable 
                    key={wallet.asset_slug}
                    wallet={wallet}
                    isLoading={isLoading}
                  />
                ))}
              </TableTemplate>
            ) : (
              <NoCryptoWallet />
            )}
          </section>
          <section className="md:container-section
            max-md:border-y">
            <div className="px-5 py-3 border-b">
              <CashInfo 
                value={cryptoBalance}
                title="My crypto"
              />
            </div>
            {cryptoWallets.length > 0 ? (
              <TableTemplate
                className="first:pl-5 last:pr-5 py-3"
                headers={myCryptoHeaders}>
                {cryptoWallets.map((wallet) => (
                  <CryptoWalletItem 
                    key={wallet.asset_slug}
                    data={wallet}
                    isLoading={isLoading}
                    slug={wallet.asset_slug}
                    balance={wallet.balance}
                    currency={pref.currency}
                    setCryptoPrice={setCryptoPrice}
                  />
                ))}
              </TableTemplate>
            ) : (
              <NoCryptoWallet />
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


const NoCryptoWallet = () => {
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
  setCryptoPrice: (
    v: React.SetStateAction<{[K in string]: number} | null>
  ) => void
  isLoading: boolean
  currency: string
  balance: number
  slug: string
}

const CryptoWalletItem: React.FC<CryptoWalletItemProps> = ({
  data, setCryptoPrice, isLoading, currency, balance, slug
}) => 
{
  const cryptoPrice = useCoinPrice(slug, currency)

  // console.log('CryptoWalletItem.render', cryptoPrice, balance)

  React.useEffect(() => 
  {
    if (cryptoPrice)
      setCryptoPrice((currentObj) => 
        ({
          ...currentObj,
          [slug]: cryptoPrice * balance
        })
      )

  }, [cryptoPrice])


  return (
    <MyCryptoBodyTable
      wallet={data}
      isLoading={isLoading}
    />
  )
}


const WalletLogo = ({walletSlug}: {walletSlug: string}) => {
  const [wallet,] = useWallet(walletSlug)

  return (
    <img src={wallet?.asset_logo ?? ''} />
  )
}


const MyCryptoBodyTable = (
  {wallet, isLoading}: {
    wallet: WalletType
    isLoading: boolean
  }
) => 
{
  const navigate = useNavigate()


  return (
    <SkeletonTheme enableAnimation={isLoading}>
      <tr onClick={() => {
          if (!isLoading && wallet.asset_slug)
            navigate('/accounts/' + wallet.asset_slug)
        }} className="hover:bg-slate-100/50 cursor-pointer">
        <td className="flex items-center gap-3 py-5 pl-5">
          <span className="w-4" >
            {wallet.asset_slug ? (
              <WalletLogo walletSlug={wallet.asset_slug} />
            ) : (
              <Skeleton circle height="24px" width="24px" />
            )}
          </span>
          <p className="font-medium">
            {wallet.asset_name || <Skeleton />}
          </p>
        </td>
        <td>
          <p>{wallet.balance != null ? `${
            wallet.balance} ${wallet.asset_symbol}` : (
              <Skeleton /> 
            )}
          </p>
        </td>
        <td className="pr-5 text-center">
        </td>
      </tr>
    </SkeletonTheme>
  )
}


const MyCashBodyTable = (
  {wallet, isLoading}: {
    wallet: WalletType
    isLoading: boolean
  }
) => 
{
  const navigate = useNavigate()


  return (
    <SkeletonTheme enableAnimation={isLoading}>
      <tr onClick={() => {
          if (!isLoading && wallet.asset_slug)
            navigate('/accounts/' + wallet.asset_slug)
        }} className="hover:bg-slate-100/50 cursor-pointer">
        <td className="flex items-center gap-3 py-5 pl-5">
          <span className="w-4" >
            {wallet.asset_slug ? (
              <WalletLogo walletSlug={wallet.asset_slug} />
            ) : (
              <Skeleton circle height="24px" width="24px" />
            )}
          </span>
          <p className="font-medium">
            { wallet.asset_name || <Skeleton /> }
          </p>
        </td>
        <td>
          <p>{wallet.balance != null ? (
              <PriceDisplay price={ wallet.balance } />
            ) : (
              <Skeleton /> 
            )}
          </p>
        </td>
        <td className="pr-5 text-center">
        </td>
      </tr>
    </SkeletonTheme>
  )
}
