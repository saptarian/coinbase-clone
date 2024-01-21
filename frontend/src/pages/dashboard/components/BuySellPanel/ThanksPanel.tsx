import { Link } from "react-router-dom"
import { WalletBalanceInfo } from './WalletBalanceInfo'
import { FormOrderContext } from "./BuySellPanel"
import { formatDecimal } from '@/lib/helper'


export const ThanksPanel = ({context, handleState, onDone}: {
  context: FormOrderContext
  handleState: (idx: number) => void
  onDone?: () => void
}) => 
{
  const { asset, order, wallet, assetPrice } = context

  if (!order) return ''
  
  return (
    <div className="text-center px-5 py-5 space-y-3">
      <h2 className="text-4xl text-blue-600 leading-9 pt-5">
        {
          order.order_type === 'buy'
          ? `${formatDecimal(order.amount, 7)} ${asset?.asset_symbol}`
          : `${Math.round(order.amount * order.price
            )} ${wallet?.asset_symbol}`
        }
      </h2>
      <h3 className="font-medium text-md pb-5 text-gray-600">
        {
          order.order_type === 'buy' 
          ? "Successfully purchased"
          : "Added to your account"
        }
      </h3>
      <p className="text-gray-700 leading-5 py-5 border
        font-medium rounded-md text-sm px-5">
        Congrats you pay zero fees in demo account
        <a href="#" className="link"> Learn more</a>
      </p>
      <button
        onClick={() => handleState(0)}
        className="primary-btn-sm block w-full">
        Buy & Sell
      </button>
      <Link to={`/accounts/${asset?.asset_slug ?? 'USD'}`} 
        className="secondary-btn-sm block w-full"
        onClick={() => {
          if (onDone)
            onDone()
        }}>
        View transaction
      </Link>
      <WalletBalanceInfo 
        assetPrice={assetPrice} 
        wallet={asset}
      />
    </div>
  )
}
