import { Outlet, useOutletContext } from "react-router-dom"
import { useCoin, useCoins, useWallet } from '@/lib/hooks'
import { DashboardContextType } from "@/lib/context"
import BuySellPanel from '../components/BuySellPanel'
import InnerPageHeader from './InnerPageHeader'
import CoinList from '../components/CoinList'
import { CryptoDetailed, WalletOrNotFound } from "@/types"


export interface AssetViewContext extends 
DashboardContextType {
  coin: CryptoDetailed | undefined
  // slug: string | undefined
  wallet: WalletOrNotFound | undefined
  isLoading: boolean
}

export function AssetView() {
  const { pref, slug, identity, ...rest } = 
    useOutletContext<DashboardContextType>()
  const { currency } = pref
  const [ wallet, ] = useWallet(slug)
  const [ coin, ] = useCoin(slug, currency)
  const { coins, isLoading } = useCoins({
    limit: 10, 
    index: 0,
    currency
  })

  // console.log('AssetView.render', from)
  const context: AssetViewContext = {
    coin, slug, pref, wallet, 
    isLoading, identity, ...rest
  }


  return (
    <main className="max-w-screen-xl md:py-3
      mx-auto md:px-5 grow w-full">
      <div className="py-5">
        <InnerPageHeader
          logo={coin?.logo ?? wallet?.asset_logo}
          name={coin?.name ?? wallet?.asset_name}
          symbol={coin?.symbol ?? wallet?.asset_symbol}
          slug={slug ?? wallet?.asset_slug} />
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        <div className="flex flex-col gap-5 grow">

          <Outlet context={context} />

        </div>
        <div className="lg:w-[340px] flex flex-col gap-5 shrink-0">
          {wallet && wallet.asset_is_fiat === true ? '' : (
            <>
              <section className="container-section
                hidden md:block">
                <BuySellPanel 
                  assetSlug={slug}
                  isUserVerified={identity?.verified}
                />
              </section>
              <hr />
            </>
          )}
          <section className="md:container-section">
            <CoinList
              title="Top 10 cryptocurrencies"
              coins={coins}
              isLoading={isLoading}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
