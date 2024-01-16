import Skeleton from 'react-loading-skeleton'
import { formatDecimal, formatCurrency } from '@/lib/helper'
import { WalletOrNotFound } from '@/types'


export const WalletBalanceInfo = (
  {wallet, assetPrice}: {
    wallet?: WalletOrNotFound
    assetPrice?: number
  }
) => 
{
  if (!wallet) return <Skeleton />

  let balance = ''
  const price = assetPrice || wallet.asset_price

  if (wallet.balance)
    if (wallet.asset_is_fiat)
      balance = formatCurrency(wallet.balance, wallet.asset_symbol)

    else 
      balance = `${
        formatDecimal(wallet.balance)} ${wallet.asset_symbol} = ${
        price ? formatCurrency(Math.floor(wallet.balance * price ))
        : "$$$"
      }`
        
  else if (wallet.asset_symbol)
    balance = `0 ${wallet.asset_symbol} = $0.00`


  return (
    <div className="flex justify-between font-medium py-2">
      <small className="text-gray-600">{wallet?.asset_name} balance </small>
      <span className="text-gray-700 text-sm flex items-center gap-2">
        {balance}
      </span>
    </div>
  )
}
