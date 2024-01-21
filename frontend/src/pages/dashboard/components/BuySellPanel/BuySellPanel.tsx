import React from 'react'

import { useWallet, useFormOrder, useCoinPrice } from '@/lib/hooks'
import { FetcherFormProps, useLocation } from 'react-router-dom'
import { OrderPanel } from './OrderPanel'
import { ThanksPanel } from './ThanksPanel'
import { useDashboard } from '@/lib/context'
import { OrderPreview } from './OrderPreview'
import { FormOrderType, WalletOrNotFound } from '@/types'

const FAKE_VERIFIED = true


type BuySellPanelProps = {
  assetSlug?: string
  walletSlug?: string
  isUserVerified?: boolean
  onDone?: () => void
}

export type FormOrderContext = {
  Form: React.ForwardRefExoticComponent<
    FetcherFormProps & React.RefAttributes<HTMLFormElement>
  >
  order: FormOrderType
  isSubmiting: boolean
  asset?: WalletOrNotFound
  wallet?: WalletOrNotFound
  assetPrice?: number
  isLoading?: boolean
  currency?: string
}

export type OrderOptionsType = {
  asset: string
  wallet: string
}

const BuySellPanel: React.FC<BuySellPanelProps> = ({
  assetSlug='bitcoin', 
  walletSlug='USD', 
  isUserVerified=false, 
  onDone
}) =>
{
  const {Form, isSubmiting, order, ok} = useFormOrder()
  const [panelIndex, setPanelIndex] = React.useState(0)
  const [options, setOptions] = React.useState<OrderOptionsType>({
    asset: assetSlug,
    wallet: walletSlug,
  })
  const [wallet, isWalletLooading] = useWallet(options.wallet)
  const [asset, isAssetLoading] = useWallet(options.asset)

  const {pref} = useDashboard()
  const {currency} = pref

  const slugUsed = asset?.asset_slug ?? asset?.cmc_asset_slug ?? assetSlug
  const assetPrice = useCoinPrice(slugUsed, currency)

  const isLoading = isWalletLooading || isAssetLoading

  const location = useLocation()
  // console.log(location)

  React.useEffect(() => {
    setPanelIndex(0)
  }, [location.pathname.split('/').at(-1)])

  React.useEffect(() => {
    if (order.done) setPanelIndex(9)
    else if (order.uuid) setPanelIndex(5)
    else if (!ok) setPanelIndex(0)
  }, [order.done, order.uuid, ok])


  React.useEffect(() => {
    setOptions((currentObj) => ({
      ...currentObj,
      asset: assetSlug,
    }))
  }, [assetSlug])


  React.useEffect(() => {
    if (options.asset === options.wallet)
      setOptions({
        asset: 'bitcoin',
        wallet: 'USD',
      })
  }, [options.asset, options.wallet])

  const context: FormOrderContext = {
    Form, isSubmiting, order, wallet, 
    asset, assetPrice, currency, isLoading,
  }
  // console.log('BuySellPanel.render', {options, context}, [assetSlug, walletSlug])

  if (!isUserVerified && !FAKE_VERIFIED)
    return <VerifyInfo /> 

  if (panelIndex === 9)
    return <ThanksPanel
      onDone={onDone}
      context={context}
      handleState={setPanelIndex} />

  if (panelIndex === 5)
    return <OrderPreview 
      context={context}
      onCancel={(orderType) => {
        setPanelIndex(orderType === 'sell' ? 1 : 0)        
      }} />


  return (
    <>
      <TabPanel 
        panelActiveIndex={panelIndex}
        setPanelIndex={setPanelIndex}
      />
      <OrderPanel
        context={context}
        updateOptions={setOptions}
        orderType={panelIndex === 1 ? "sell": "buy"}
      />
    </>
  )
}


const VerifyInfo = () => (
  <div className="text-center px-5 py-5 space-y-3">
    <h3 className="font-medium">Verify info</h3>
    <p className="text-gray-700 leading-4 pb-5">
      To continue, please finish setting up
      your account.
    </p>
    <button className="primary-btn-sm
    ">Verify info</button>
  </div>
)


const TabPanel = ({
  panelActiveIndex, setPanelIndex
}: {
  panelActiveIndex: number
  setPanelIndex: (idx: number) => void
}) => 
{
  return (
    <div className="flex divide-x">
      {["Buy", "Sell"].map((v, i) => (
        <button key={v}
          className={`w-full py-2 ${panelActiveIndex === i
            ? "border-t-2 border-t-blue-600" 
            : "py-2 border-b"
          }`}
          onClick={() => setPanelIndex(i)}>{v}</button>
        ))}
    </div>
  )
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const LoadingPanel = () => {
//   return (
//     <div className="px-5 py-3 space-y-3">
//       <Skeleton />
//       <div className="rounded-md border divide-y px-2">
//         <Skeleton />
//         <Skeleton />
//       </div>
//       <div className="py-2">
//         <Skeleton />
//       </div>
//       <Skeleton />
//     </div>
//   )
// }


export default BuySellPanel 
