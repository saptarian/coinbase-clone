import React from 'react'
import { WalletBalanceInfo } from './WalletBalanceInfo'
import { FormOrderType, WalletOrNotFound } from '@/types'
import { FormOrderContext } from './BuySellPanel'
import { formatCurrency, formatDecimal } from '@/lib/helper'
import { ArrowLeft } from '@/components/Icons'
import Button from '@/components/Button'


export const OrderPreview = ({ context, onCancel }: {
  context: FormOrderContext
  onCancel: (orderType: string) => void
}) =>
{
  const {Form, asset,
    order, wallet, assetPrice, isSubmiting} = context

  if (!wallet || !asset || !order)
    return (
      <div className="text-center px-5 py-5 space-y-3">
        <h3 className="font-medium text-md pb-5 text-gray-600">
          Create order failed
        </h3>
        <p className="text-gray-700 leading-5 py-5 border
          font-medium rounded-md text-sm px-5">
          Something missing when create preview order
          <a href="#" className="link"> Get help</a>
        </p>
        <button
          onClick={() => onCancel('buy')}
          className="primary-btn-sm block w-full">
          Cancel
        </button>
      </div>
    )

  const previewList = previewMap(wallet, asset, order)
  // console.log('OrderPreview.render', order)
  
  return (
    <Form method="post" action="/complete" className="px-5 py-3">
      <div className="relative pt-3">
        <button type="button"
          onClick={() => onCancel(order.order_type)}
          className="absolute py-1.5 px-1">
          <ArrowLeft 
            className="text-gray-600 w-4 hover:text-pink-300" 
          />
        </button>
        <h2 className="text-center font-medium text-md w-full">
          Order preview
        </h2>
      </div>
      <h3 data-suffix={` ${asset.asset_symbol}`}
        className="mt-4 mb-12 text-center font-medium text-3xl
        text-blue-600 truncate
        after:content-[attr(data-suffix)] ">
        {order.amount ? formatDecimal(order.amount, 7) : 0}
      </h3>
      {previewList.map((item, idx) => 
        <PreviewItem key={idx} {...item}/>
      )}
      <input type="hidden" name="uuid" value={order.uuid} />
      <div className="py-2">
        <Button type="submit" 
          isLoading={isSubmiting}>
          {order.order_type === 'buy' ? 'Buy now' : 'Sell now'}
        </Button>
      </div>
      <WalletBalanceInfo 
        assetPrice={assetPrice} 
        wallet={asset}
      />
    </Form>
  )
}


const previewMap = (
  wallet: WalletOrNotFound, 
  asset: WalletOrNotFound, 
  order: FormOrderType
) => 
{
  return [
    { 
      label: order.order_type === 'buy' ? 'Pay with' : 'Add to', 
      value: wallet.asset_symbol + ' Wallet', 
      iconUrl: wallet.asset_logo
    },
    { 
      label: 'Price', 
      value: formatCurrency(order.price) + ' / ' + asset.asset_symbol
    },
    { 
      label: order.order_type === 'buy' ? 'Purchase' : 'Sell value',
      value: formatCurrency(Math.floor(order.price * order.amount))
    },
    { label: 'Fee', value: '$0'},
    { label: 'Total', value: formatCurrency(order.total) },
  ]
}


const PreviewItem = ({label, value, iconUrl}: {
  label: string, value: string, iconUrl?: string
}) => (
  <div className="flex justify-between font-medium mb-4">
    <small className="text-gray-600">{label}</small>
    <span className="text-gray-700 text-sm flex items-center gap-2">
      {iconUrl ? <img src={iconUrl} width="18px" /> : '' }
      {value}
    </span>
  </div>
)
