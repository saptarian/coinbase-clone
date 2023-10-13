import { 
  useRouteLoaderData 
} from 'react-router-dom'
import { BuySellPanel } from './components'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCoins } from 'lib/hooks'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const loader = async ({ request }: LoaderFunctionArgs) => {
  return { ok:true }
}

function Trade() {
  const { data, isLoading } = useCoins()

  return (
    <main className="max-w-screen-xl md:px-5 md:py-3 flex 
      gap-3 mx-auto flex-col xl:flex-row">
      <section className="w-full">
        <div className="container-section">
          <div className="flex gap-3 px-5 py-5">
            <input type="text" placeholder="Search all assets"
            className="rounded-full border px-7 py-3 grow w-12" />
            <select name="time" className="
              rounded-md border px-3 py-3 shrink-0">
              <option value="1d">1D</option>
            </select>
          </div>
          <hr/>
          <div className="overflow-x-hidden px-5 py-2">
            <table className="w-full table-fixed leading-5">
              <thead className="max-sm:hidden">
                <tr className="text-sm text-gray-500 text-left">
                  <th className="px-2 py-5">Name</th>
                  <th className="px-2 py-5 w-[180px]">Price</th>
                  <th className="px-2 py-5 w-[80px]">Change</th>
                  <th className="px-2 py-5 w-[110px]">Market cap</th>
                  <th className="px-2 py-5 w-[95px]
                    max-md:hidden"></th>
                </tr>
              </thead>
              <tbody className="text-left">
                {(!isLoading && data?.coins)
                  ? data.coins.map((coin, idx) => 
                    (<CoinRow 
                      key={idx} 
                      loading={isLoading} 
                      {...coin}
                    />))
                  : Array.from({length: 7}, (_, idx) => idx).map((val) => 
                    (<CoinRow key={val} loading={isLoading}/>))
                }
                <tr className="hover:bg-slate-100/50 
                  cursor-pointer">
                  <td className="flex items-center gap-3 
                    grow px-2 py-4 text-left">
                    <div className="bg-slate-200 w-8 h-8
                      flex items-center rounded-full">
                    </div>
                    <div>
                      <h3 className="font-medium">Bitcoin
                      </h3>
                      <span className="text-gray-500">BTC
                      </span>
                    </div>
                  </td>
                  <td className="px-2 max-sm:text-right">
                    <p>IDR 396,773,293.14</p>
                    <span className="sm:hidden text-green-600">
                      5.93%
                    </span>
                  </td>
                  <td className="text-green-600 px-2 max-sm:hidden">
                    5.93%
                  </td>
                  <td className="px-2 max-sm:hidden">
                    IDR 8235.1T
                  </td>
                  <td className="px-2 max-md:hidden">
                    <button className="primary-btn-sm">Buy</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="flex gap-3 xl:flex-col xl:shrink-0
        xl:w-[280px] flex-col md:flex-row">
        <section className="max-lg:hidden w-full">
          <div className="container-section">
            <BuySellPanel />
          </div>
        </section>

        <section className="w-full">
          <div className="container-section">
            <h2 className="px-5 py-3 font-medium md:border-b">
              New on Coinbase
            </h2>
            <ul>
              <li className="max-md:mx-auto">
                <a href="#" className="hover:bg-slate-100/50 block">
                  <div className="flex items-center gap-3 px-5 py-3 ">
                    <div className="bg-slate-100 w-7 h-7 rounded-full">
                    </div>
                    <div>
                      <h2 className="leading-3">Helium</h2>
                      <small className="text-gray-500">
                        Added 3 weeks ago
                      </small>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="w-full">
          <div className="container-section">
            <h2 className="px-5 py-3 font-medium md:border-b">
              Recent Transactions
            </h2>
            <div className="py-5 px-5 space-y-5">
              <p className="leading-6">
                You don't own any crypto.<br/>
                Ready to make a purchase?
              </p> 
              <button className="text-white px-7 py-2
                btn-bg-blue rounded-full font-medium">Trade</button>
            </div>
          </div>
        </section>

      </div>

    </main>
  )
}

const CoinRow = ({loading, ...coin}) => (
  <SkeletonTheme enableAnimation={loading}>
  <tr 
    className="hover:bg-slate-100/50 cursor-pointer">
    <td className="flex items-center gap-3 
      grow px-2 py-4 text-left">
      <div className="">
        {coin.iconUrl 
          ? <img src={coin.iconUrl} width="24px" className="rounded-full" />
          : <Skeleton width="32px" height="32px" circle /> 
        }
      </div>
      <div className="w-full">
        <h3 className="font-medium">
          {coin.name || <Skeleton />}
        </h3>
        <span className="text-gray-500">
          {coin.symbol || <Skeleton />}
        </span>
      </div>
    </td>
    <td className="px-2
      max-sm:text-right">
      <p>{coin.price || <Skeleton />}</p>
      <span className="sm:hidden text-green-600">
        {coin.change || <Skeleton />}
      </span>
    </td>
    <td className="text-green-600
      px-2 max-sm:hidden">{coin.change || <Skeleton />}</td>
    <td className="px-2 
      max-sm:hidden">{coin.marketCap || <Skeleton />}</td>
    <td className="px-2 max-md:hidden">
      {coin.price
        ? (<button className="primary-btn-sm">Buy</button>)
        : ''
      }
    </td>
  </tr>
  </SkeletonTheme>
)

export default { 
  loader,
  element: <Trade />
}
