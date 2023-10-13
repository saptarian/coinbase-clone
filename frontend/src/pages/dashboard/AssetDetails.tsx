import * as React from 'react'
import { 
  Outlet, 
  Link, 
  useRoutes, 
  useParams 
} from "react-router-dom"
import { assets } from '$/constants'
import { coloredNumber } from 'lib/helper'
import { useCoin } from 'lib/hooks'
import { BuySellPanel } from './components'


function AssetDetails() {
  const { name: slug } = useParams<"name">()
  const { data, isLoading } = useCoin(slug)

  console.log(data)

  const asset = assets.find(({name}) => 
    (name?.toLowerCase() === data?.name?.toLowerCase()))

  // if (!asset) return <div className="">Asset not found!</div>

  return (
    <main className="max-w-screen-xl xl:px-12 md:py-3
      mx-auto md:px-5">
      <div className="py-5">
        <header>
          <div className="flex items-end gap-2 font-medium
            py-3 px-5">
            <div className="w-9 h-9 rounded-full
              text-center text-white font-medium mr-3 text-2xl">
              {data?.iconUrl ? <img src={data?.iconUrl} width="60px" /> : 'B'}
            </div>
            <h1 className="text-3xl">{data?.name || asset?.name}</h1>
            <h2 className="text-gray-500 text-xl">{data?.symbol || asset?.alias}</h2>
          </div>
        </header>
        <nav className="py-3">
          <div className="flex gap-5 font-medium border-b px-5">
            <div className="space-y-1">
              <button className="text-gray-800 px-2">
                Overview
              </button>
              <div className="bg-gray-800 h-[2px]"></div>
            </div>
            <div className="space-y-1">
              <button className="text-gray-500 px-2">
                Primary balance
              </button>
              <div className="bg-gray-800 h-[2px] hidden"></div>
            </div>
          </div>
          <hr />
        </nav>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">

        <div className="flex flex-col gap-5 w-full">
          <section className="container-section">
            <div className="px-5 py-5 flex justify-between md:px-9">
              <div className="flex gap-2">
                <h3 className="text-3xl">
                  {data?.price || asset?.price}
                </h3>
                <h4 className="text-green-500 font-medium">
                  {data?.change || asset?.change}
                </h4>
              </div>
              <div className="flex gap-2 text-sm text-gray-500">
                <a href="">1H</a>
                <a href="">1D</a>
                <a href="">1W</a>
                <a href="">1M</a>
                <a href="">1Y</a>
                <a href="">ALL</a>
              </div>
            </div>
            <div className="w-full h-52 bg-slate-200">Chart</div>
            <div className="px-5 py-3">
              <h5 className="font-medium py-2">
                Market stats
              </h5>
              <div className="md:flex flex-wrap gap-7">
                {asset?.stats?.map((sta) =>
                  sta.sub && (<StatsItem 
                    title={sta.title}
                    sub={sta.sub} 
                    spanTitle={sta.spanTitle} 
                    spanSub={sta.spanSub} 
                    key={sta.title}/>)
                )}

                <div className="border-t w-full flex py-3 gap-3
                  justify-between items-center">
                  <div className="flex py-3 flex-col">
                    <p className="font-medium text-gray-500">
                      Performance
                    </p>
                    <small className="text-gray-600 max-md:hidden">
                      {asset?.performance?.lastUpdated}
                    </small>
                  </div>
                  <div className="flex justify-center items-center">
                    <p className="px-5 border-l">
                      Past {asset?.performance?.range}
                    </p>
                    <div className="border-l flex gap-4 px-5">
                      <div className="flex flex-col">
                        <small className="text-xs text-gray-600">
                          {data?.name || asset?.name}
                        </small>
                        <span className="text-sm">
                          {asset?.performance?.value}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <small className="text-xs text-gray-600">
                          Market
                        </small>
                        <span className="text-sm">
                          {asset?.performance?.market}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </section>

          <article className="container-section">
            <div className="px-7 py-5">
              <h2 className="text-2xl font-medium py-2">
                Overview
              </h2>
              <p className="py-5 text-gray-800">
                {asset?.description}
              </p>
              <h3 className="font-medium text-gray-600">
                RESOURCES
              </h3>
              <ul className="py-2 text-sky-600 space-y-1">
                {asset?.resources?.map(res => (
                  <li key={res.label}>
                    <a href={res.href} className="link">
                      {res.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="py-3">
                <h3 className="font-medium text-gray-600">APY</h3>
                <p className="py-2 text-sm">{asset?.apy}</p>
              </div>
              <div className="py-3">
                <a href="#" className="link">
                  Learn more
                </a>
              </div>
            </div>
          </article>
        </div>

        <div className="lg:w-[340px] flex flex-col gap-5
          w-full flex-none">
          <section className="container-section 
            max-md:hidden">
            <BuySellPanel />
          </section>

          <hr />

          <section className="container-section">
            <div className="px-5 py-3">
              <h2 className="font-medium text-lg">
                Price colleration with
              </h2>
              <a href="#" className="flex gap-3 py-3
                justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-7 h-7 bg-gray-300
                    rounded-full"></div>
                  <div className="leading-5">
                    <h3 className="font-medium ">
                      Wrapped Bitcoin
                    </h3>
                    <p className="text-gray-700">
                      Moves tightly together
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-gray-700 font-medium">
                    $24,429,82
                  </h4>
                  <p className="text-sm text-gray-700">98%</p>
                </div>
              </a>
            </div>
          </section>
        </div>
        {/*<div className="flex gap-5 xl:flex-col xl:shrink-0
        xl:w-[320px] flex-col md:flex-row">
          <hr/ >
          <BuySellPanel />
        </div>*/}

      </div>
    </main>
  )
}

const StatsItem = ({title, sub, spanTitle, spanSub}) => {
  const spanTitleRef = React.useRef(null)
  const spanSubRef = React.useRef(null)

  React.useEffect(() => {
    coloredNumber(spanTitleRef.current)
    coloredNumber(spanSubRef.current)
  }, [])

return (
  <div className="flex pt-3 pb-7
    md:flex-col flex-wrap">
    <h6 className="font-medium basis-1/2 md:flex-none
      text-gray-500">{title}
    </h6>
    <p className="basis-1/2 md:flex-none
      text-right md:text-left">{sub}
    </p>
    <span className="text-sm basis-1/2 md:flex-none
      text-gray-500" ref={spanTitleRef}>{spanTitle}
    </span>
    <span className="text-sm basis-1/2 md:flex-none
      text-right md:text-left
      text-gray-500" ref={spanSubRef}>{spanSub}
    </span>
  </div>
  )
}

export default { element: <AssetDetails /> }
