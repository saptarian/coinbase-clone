import { useOutletContext } from "react-router-dom"

import { assetPriceInCurrency } from '@/lib/helper'
import TransactionList from '../components/TransactionList'
import { AssetViewContext } from "."


export function AssetWallet() 
{
  const { slug, pref, coin, wallet } = 
    useOutletContext<AssetViewContext>()
  // console.log('AssetWallet.render', {coin, wallet})

  return (
    <>
      <section className="container-section">
        <div className="px-5 py-5">
          <BalanceInfo 
            symbol={wallet?.asset_symbol || coin?.symbol}
            balance={wallet?.balance}
            price={coin?.price || 1} 
            currency={pref.currency}
          />
        </div>
      </section>
      <section className="container-section">
        <TransactionList assetSlug={slug} />
      </section>

    </>
  )
}


const BalanceInfo = ({symbol, balance, price, currency}: {
  symbol?: string
  balance?: number
  price?: number
  currency: string
}) => {
  // console.log('BalanceInfo.render', symbol, balance, price, currency)

  return (
    <div className="leading-5">
      <h3 className="font-medium text-md text-stone-500">
        {`${balance ?? 0} ${symbol ?? ''}`}
      </h3>
      <h2 className="font-medium text-3xl">
        {balance && price 
        ? assetPriceInCurrency(balance, price, currency)
        : assetPriceInCurrency(0, 1, currency)}
      </h2>
    </div>
  )
}
