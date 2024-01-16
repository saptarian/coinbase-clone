import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { useOutletContext } from "react-router-dom"
import { 
  PriceDisplay, 
  DecimalDisplay, 
  StyledNumericDisplay 
} from '@/components/Numeric'
import { AssetViewContext } from "."
import { AssetStats, CryptoDetailed } from "@/types"
import { useHistorialData } from "@/lib/hooks"
import Chart from "@/components/Chart"

const dataLimit = {
  '1M': 30, '1Y': 365, '2Y': 365 * 2,
  '3Y': 365 * 3, '4Y': 365 * 4,
}

type PeriodeKeyType = keyof typeof dataLimit


export function AssetDetail()
{
  const {coin} = useOutletContext<AssetViewContext>()
  const [isPending, startTransition] = React.useTransition()
  const [periodeKey, setPeriodeKey] = 
    React.useState<PeriodeKeyType>( '3Y' )

  const handleClickTimePeriode = (p: PeriodeKeyType) => {
    startTransition(() => {
      setPeriodeKey(p)
    })
  }

  return (
    <>
      <section className="container-section">
        <div className="px-5 py-5 flex justify-between md:px-9">
          <AssetPrice coin={coin} />
          <ChartOptions 
            periodeKey={periodeKey}
            onClickTime={handleClickTimePeriode}
          />
        </div>
        {coin ? (
          <ChartBox 
            coin={coin} 
            isPending={isPending} 
            periodeKey={periodeKey}
          />
        ) : ''}
        <Stats coin={coin} />
      </section>
      <AssetOverview coin={coin} />
    </>
  )
}


const AssetOverview = ({coin}: {
  coin?: CryptoDetailed
}) => 
{
  return (
    <article className="container-section">
      <div className="px-7 py-5">
        <h2 className="text-2xl font-medium py-2">
          Overview
        </h2>
        <p className="py-5 text-gray-800">
          {coin?.description || <Skeleton count={7} />}
        </p>
        <h3 className="font-medium text-gray-600">
          RESOURCES
        </h3>
        {coin ? (
          <ul className="py-2 text-sky-600 space-y-1">
            <li><a 
              href={
                coin?.urls?.website[0] 
                || `https://www.google.com/search?q=${coin?.slug ?? ''}`
              } className="link" target="_blank"> Website</a>
            </li>
            <li><a 
              href={
                coin?.urls?.reddit[0] 
                || `https://www.reddit.com/search/?q=${coin?.slug ?? ''}`
              } className="link" target="_blank"> Reddit</a>
            </li>
          </ul>
        ) : <Skeleton count={2} width="7rem" />}
      </div>
    </article>
  )
}


const Stats = ({coin}: {
  coin?: CryptoDetailed
}) => 
{
  return (
    <div className="px-5 py-3">
      <h5 className="font-medium py-2">
        Market stats
      </h5>
      <div className="md:flex flex-wrap gap-7">
        {coin ? coin.stats?.map((sta) =>
          sta.sub && (<StatsItem 
            title={sta.title}
            sub={sta.sub} 
            spanTitle={sta.spanTitle} 
            spanSub={sta.spanSub} 
            key={sta.title}/>)
        ) : (
          <ul className="w-full flex gap-7">
            {Array.from({length: 4}, (_,idx) => (
              <li key={idx}
                className="w-24">
                <Skeleton height="2rem" />
              </li>
            ))}
          </ul>
          
        ) }
        {/* <AssetPerformance asset={null} /> */}
      </div>
    </div>
  )
}


const AssetPrice = ({coin}: {
  coin?: CryptoDetailed
}) => 
{
  return (
    <div className="flex gap-2">
      <h3 className="text-3xl">
        {coin?.price ? (
          <PriceDisplay price={ coin.price } />
        ) : <Skeleton width="4rem"/>}
      </h3>
      
      {coin?.percent_change_24h ? (
        <h4 className="font-medium">
          <StyledNumericDisplay
            valueWithSign={coin.percent_change_24h} >
            <DecimalDisplay value={coin.percent_change_24h} />
          </StyledNumericDisplay>
        </h4>
      ) : <Skeleton width="4rem"/>}
    </div>
  )
}


const ChartOptions = ({periodeKey, onClickTime}: {
  periodeKey: PeriodeKeyType
  onClickTime: (p: PeriodeKeyType) => void
}) => 
{
  return (
    <div className="flex gap-2 text-sm text-gray-500">
      {(Object.keys(dataLimit) as PeriodeKeyType[]).map((periode) => (
        <button key={periode}
          className={`${periodeKey === periode ? "" : "link"}`}
          onClick={() => onClickTime(periode)}>
          {periode}
        </button>
      ))}
    </div>
  )
}


const ChartBox = ({coin, periodeKey, isPending}: {
  coin: CryptoDetailed
  periodeKey: PeriodeKeyType
  isPending: boolean
}) => 
{
  const [data, isLoading] = useHistorialData(coin.symbol)
  const maxY = React.useMemo(() => {
    if (data?.['adj-close'].length) {
      const highestVal = Math.max(...data['adj-close'])
      return Math.ceil(highestVal + (highestVal * 0.20))
    }
  }, [coin.symbol])

  const chartData = React.useMemo(() => {
    return {
      date: data?.date?.slice(-dataLimit[periodeKey]),
      data: data?.['adj-close']?.slice(-dataLimit[periodeKey]),
    }
  }, [periodeKey, coin.symbol, isLoading])

  // console.log('ChartBox.render', chartData)


  return (
    <div className="w-full h-52 bg-slate-200/75
      overflow-x-hidden">
      {!isPending && !isLoading 
        && data?.['adj-close'].length ? (
        <Chart
          X={chartData?.date}
          data={chartData?.data}
          style={{
            height: '100%',
            // width: '100%',
          }}
          yLimit={maxY}
        />
      ) : <Skeleton count={7} height="0.5rem" />}
    </div>
  )
}


const StatsItem: React.FC<AssetStats> = (
  {title, sub, spanTitle, spanSub}
) => 
{
  return (
    <div className="flex pt-3 pb-7
      md:flex-col flex-row flex-wrap">
      <h6 className="font-medium basis-1/2 md:flex-none
        text-gray-500">{title}
      </h6>
      <p className="basis-1/2 md:flex-none
        text-right md:text-left">{sub}
      </p>
      <span className="text-sm basis-1/2 md:flex-none
        text-gray-500">
        {spanTitle ? (
          <StyledNumericDisplay
            valueWithSign={spanTitle} >
            {spanTitle}
          </StyledNumericDisplay>
        ) : ''}
      </span>
      <span className="text-sm basis-1/2 md:flex-none
        text-right md:text-left text-gray-500">
        {spanSub ? (
          <StyledNumericDisplay
            valueWithSign={spanSub} >
            {spanSub}
          </StyledNumericDisplay>
        ) : ''}
      </span>
    </div>
  )
}


// const AssetPerformance = ({asset}: {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   asset: {[K in string]?: any} | null
// }) => 
// {
//   if (asset == null)
//     return ''

//   return (
//     <div className="border-t w-full flex py-3 gap-3
//       justify-between items-center">
//       <div className="flex py-3 flex-col">
//         <p className="font-medium text-gray-500">
//           Performance
//         </p>
//         <small className="text-gray-600 max-md:hidden">
//           {asset?.performance?.lastUpdated}
//         </small>
//       </div>
//       <div className="flex justify-center items-center">
//         <p className="px-5 border-l">
//           Past {asset?.performance?.range}
//         </p>
//         <div className="border-l flex gap-4 px-5">
//           <div className="flex flex-col">
//             <small className="text-xs text-gray-600">
//               {asset?.name}
//             </small>
//             <span className="text-sm">
//               {asset?.performance?.value}
//             </span>
//           </div>
//           <div className="flex flex-col">
//             <small className="text-xs text-gray-600">
//               Market
//             </small>
//             <span className="text-sm">
//               {asset?.performance?.market}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

