import Nav from '$/components/Nav'
import { isLoggedIn } from 'lib/auth'
import logo from '$/assets/logo-coinbase.svg'


function Explore() {
  const isAuthenticated = isLoggedIn()

return (
<>
<Nav isAuthenticated={isAuthenticated} />
<main className="max-w-screen-2xl mx-auto ring-1 ring-slate-200
  pt-4">
  <section className="flex flex-col gap-1 px-5 mb-1
    md:max-w-xl md:items-center mx-auto md:py-12">
    <h1 className="text-2xl font-medium md:text-[42px]
      md:font-normal"> Explore the cryptoeconomy
    </h1>
    <p className="text-slate-500 md:p-2 md:mb-2 ">
      Market is down <span className="text-red-600">0.36%</span> (24h)
    </p>
    <input type="text" placeholder="Search for an asset" 
      className="ring-1 ring-gray-500 h-9 px-10 rounded-full
      my-2 w-full md:h-14 hover:bg-slate-100/50
      md:text-xl" 
    />
  </section>
  <hr className="max-md:hidden " />

  <section className="xl:flex flex-row-reverse ">
    <div className="hidden md:flex xl:flex-col
      xl:w-[380px] shrink-0">
      <div className="flex flex-col gap-2 p-3 basis-1/2
        ring-1 ring-slate-200">
        <h2 className="font-medium text-xl px-4 py-2 mt-3 ">
          New on Coinbase
        </h2>
        <ul>
          <li>
            <a href="#" className="flex items-center gap-3 
              justify-between py-2 px-4 hover:bg-slate-100/50 
              cursor-pointer rounded-lg">
              <div className="flex items-center gap-3 flex-grow ">
                <div>
                  <img src={logo} width="20px" alt=""/>
                </div>
                <div>
                  <h2 className="font-medium "> Helium </h2>
                  <p className="text-gray-500 "> HNT </p>
                </div>
              </div>
              <div className="text-right ">
                <p>
                  <span className="text-green-500 ">1,966.63 %</span> views
                </p>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 
              justify-between py-2 px-4 hover:bg-slate-100/50 
              cursor-pointer rounded-lg">
              <div className="flex items-center gap-3 flex-grow ">
                <div>
                  <img src={logo} width="20px" alt=""/>
                </div>
                <div>
                  <h2 className="font-medium "> Helium </h2>
                  <p className="text-gray-500 "> HNT </p>
                </div>
              </div>
              <div className="text-right ">
                <p>
                  <span className="text-green-500 ">1,966.63 %</span> views
                </p>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 
              justify-between py-2 px-4 hover:bg-slate-100/50 
              cursor-pointer rounded-lg">
              <div className="flex items-center gap-3 flex-grow ">
                <div>
                  <img src={logo} width="20px" alt=""/>
                </div>
                <div>
                  <h2 className="font-medium "> Helium </h2>
                  <p className="text-gray-500 "> HNT </p>
                </div>
              </div>
              <div className="text-right ">
                <p>
                  <span className="text-green-500 ">1,966.63 %</span> views
                </p>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-2 p-3 grow
        ring-1 ring-slate-200">
        <h2 className="font-medium text-xl px-4 py-2 mt-3 ">
          Trending <span className="text-gray-500
          font-normal text-sm">24h views</span>
        </h2>
        <ul>
          <li>
            <a href="#" className="flex items-center gap-3 
              justify-between py-2 px-4 hover:bg-slate-100/50 
              cursor-pointer rounded-lg">
              <div className="flex items-center gap-3 flex-grow ">
                <div>
                  <img src={logo} width="20px" alt=""/>
                </div>
                <div>
                  <h2 className="font-medium "> Helium </h2>
                  <p className="text-gray-500 "> HNT </p>
                </div>
              </div>
              <div className="text-right ">
                <p>
                  <span className="text-green-500 ">1,966.63 %</span> views
                </p>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 
              justify-between py-2 px-4 hover:bg-slate-100/50 
              cursor-pointer rounded-lg">
              <div className="flex items-center gap-3 flex-grow ">
                <div>
                  <img src={logo} width="20px" alt=""/>
                </div>
                <div>
                  <h2 className="font-medium "> Helium </h2>
                  <p className="text-gray-500 "> HNT </p>
                </div>
              </div>
              <div className="text-right ">
                <p>
                  <span className="text-green-500 ">1,966.63 %</span> views
                </p>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 
              justify-between py-2 px-4 hover:bg-slate-100/50 
              cursor-pointer rounded-lg">
              <div className="flex items-center gap-3 flex-grow ">
                <div>
                  <img src={logo} width="20px" alt=""/>
                </div>
                <div>
                  <h2 className="font-medium "> Helium </h2>
                  <p className="text-gray-500 "> HNT </p>
                </div>
              </div>
              <div className="text-right ">
                <p>
                  <span className="text-green-500 ">1,966.63 %</span> views
                </p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="md:hidden ">
      <div>
        <a href="/" className="flex hover:bg-slate-100/40 gap-4
          items-center px-5 py-3">
          <div>
            <img src={logo} alt="" width="20px" />
          </div>
          <div>
            <h2 className="font-medium ">Biggest Gainers </h2>
            <p className="text-slate-500">
              Shapeshift FOX Token <span className="text-green-500 ">35.84% </span> price change
            </p>
          </div>
        </a>
      </div>

      <div>
        <a href="/" className="flex hover:bg-slate-100/40 gap-4
          items-center px-5 py-3">
          <div>
            <img src={logo} alt="" width="20px" />
          </div>
          <div>
            <h2 className="font-medium ">New on Coinbase </h2>
            <p className="text-slate-500">
              Shapeshift FOX Token <span className="text-green-500 ">35.84% </span> price change
            </p>
          </div>
        </a>
      </div>

      <div>
        <a href="/" className="flex hover:bg-slate-100/40 gap-4
          items-center px-5 py-3">
          <div>
            <img src={logo} alt="" width="20px" />
          </div>
          <div>
            <h2 className="font-medium ">Trending </h2>
            <p className="text-slate-500">
              Shapeshift FOX Token <span className="text-green-500 ">35.84% </span> price change
            </p>
          </div>
        </a>
      </div>

      <div>
        <a href="/" className="flex hover:bg-slate-100/40 gap-4
          items-center px-5 py-3">
          <div>
            <img src={logo} alt="" width="20px" />
          </div>
          <div>
            <h2 className="font-medium ">Free Crypto </h2>
            <p className="text-slate-500">
              Shapeshift FOX Token <span className="text-green-500 ">35.84% </span> price change
            </p>
          </div>
        </a>
      </div>
    </div>

    <div className="my-4 grow ">
      <div>
        <div className="md:flex items-center justify-between
          px-6 py-2">
          <h2 className="font-medium text-3xl hidden md:block
            mb-2">
            Crypto prices <span className="text-base
            text-gray-500 font-normal">9,371 assets</span>
          </h2>
          <div className="flex gap-2 ">
            <div className="bg-slate-100 py-2 px-4 rounded-full
              font-medium text-sm flex-grow md:hidden"
              >All assets</div>
            <div className="bg-slate-100 py-2 px-4 rounded-full
              font-medium text-sm w-[70px]"
              >IDR</div>
            <div className="bg-slate-100 py-2 px-4 rounded-full
              font-medium text-sm w-[70px]"
              >1D</div>
          </div>
        </div>

        <div className="px-6 mb-4 hidden md:block">
          <ul className="flex gap-2">
            <li>
              <a href="#" className="bg-slate-100 p-1 pr-2
                font-medium text-sm rounded-md flex items-center
                gap-1 active:text-blue-600 active:bg-slate-100/50">
                <span className="w-7 h-7 rounded-md
                  bg-blue-600"></span>
                <span>All assets</span>
              </a>
            </li>
            <li>
              <a href="#" className="bg-slate-100 p-1 pr-2
                font-medium text-sm rounded-md flex items-center
                gap-1 active:text-blue-600 active:bg-slate-100/50">
                <span className="w-7 h-7 rounded-md
                  bg-white"></span>
                <span>Tradable</span>
              </a>
            </li>
            <li>
              <a href="#" className="bg-slate-100 p-1 pr-2
                font-medium text-sm rounded-md flex items-center
                gap-1 active:text-blue-600 active:bg-slate-100/50">
                <span className="w-7 h-7 rounded-md
                  bg-white"></span>
                <span>Gainers</span>
              </a>
            </li>
            <li>
              <a href="#" className="bg-slate-100 p-1 pr-2
                font-medium text-sm rounded-md flex items-center
                gap-1 active:text-blue-600 active:bg-slate-100/50">
                <span className="w-7 h-7 rounded-md
                  bg-white"></span>
                <span>Losers</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="md:hidden ">
          <ul>
            <li className="flex items-center gap-3 justify-between
              p-5 hover:bg-slate-100/50 cursor-pointer">
              <div className="flex items-center gap-3 flex-grow ">
                <div>
                  <img src={logo} width="20px" alt=""/>
                </div>
                <div>
                  <h3 className="font-medium "> Bitcoin </h3>
                  <span className="text-gray-500 "> BTC </span>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-300 grow shrink-0 ">
                
              </div>
              <div className="text-right ">
                <p> IDR 396,773,293.14 </p>
                <small className="text-red-600 "> 0.43% </small>
              </div>
            </li>
          </ul>
        </div>

        <div className="hidden md:block overflow-x-hidden px-2">
          <table className="w-full table-fixed ">
            <thead>
              <tr className="text-sm text-gray-500 ">
                <th className="p-5 text-left">Name</th>
                <th className="p-5 text-right w-[180px]">Price</th>
                <th className="p-5 w-[70px]">Chart</th>
                <th className="p-5 w-[60px]">Change</th>
                <th className="p-5 w-[130px]">Market cap</th>
                <th className="p-5 w-[120px]">Trade</th>
              </tr>
            </thead>
            <tbody className="text-center ">
              <tr className="
                hover:bg-slate-100/50 cursor-pointer">
                <td className="flex items-center gap-3 flex-grow
                  px-5 py-2 text-left">
                  <div className="bg-gray-300 w-4 h-4 ">
                  </div>
                  <div className="bg-slate-200 w-8 h-8
                    flex items-center rounded-full">
                    <img src={logo} width="20px" className="mx-auto" alt=""/>
                  </div>
                  <div>
                    <h3 className="font-medium ">Bitcoin </h3>
                    <span className="text-gray-500 ">BTC </span>
                  </div>
                </td>
                <td className="text-right px-5 py-2">
                  IDR 396,773,293.14
                </td>
                <td className="bg-blue-300 px-5 py-2">
                </td>
                <td className="text-green-600
                  px-5 py-2">5.93%</td>
                <td className="px-5 py-2">IDR 8235.1T</td>
                <td className="px-5 py-2">
                  <button className="bg-blue-600 text-white
                  rounded-full px-6 py-2 font-medium
                  ">Trade</button>
                </td>
              </tr>
              <tr className="
                hover:bg-slate-100/50 cursor-pointer">
                <td className="flex items-center gap-3 flex-grow
                  px-5 py-2 text-left">
                  <div className="bg-gray-300 w-4 h-4 ">
                  </div>
                  <div className="bg-slate-200 w-8 h-8
                    flex items-center rounded-full">
                    <img src={logo} width="20px" className="mx-auto" alt=""/>
                  </div>
                  <div>
                    <h3 className="font-medium ">Bitcoin </h3>
                    <span className="text-gray-500 ">BTC </span>
                  </div>
                </td>
                <td className="text-right px-5 py-2">
                  IDR 396,773,293.14
                </td>
                <td className="bg-blue-300 px-5 py-2">
                  
                </td>
                <td className="text-green-600
                  px-5 py-2">5.93%</td>
                <td className="px-5 py-2">IDR 8235.1T</td>
                <td className="px-5 py-2">
                  <button className="bg-blue-600 text-white
                  rounded-full px-6 py-2 font-medium
                  ">Trade</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <div className="text-sm text-gray-500 leading-4 p-10
        ring-1 ring-slate-200 my-10">
        Certain content has been prepared by third 
        parties not affiliated with Coinbase Inc. 
        or any of its affiliates and Coinbase is 
        not responsible for such content. Coinbase 
        is not liable for any errors or delays in 
        content, or for any actions taken in reliance 
        on any content. Information is provided for 
        informational purposes only and is not investment 
        advice. This is not a recommendation to buy or 
        sell a particular digital asset or to employ a 
        particular investment strategy. Coinbase makes 
        no representation on the accuracy, suitability, 
        or validity of any information provided or for 
        a particular asset. Prices shown are for 
        illustrative purposes only. Actual cryptocurrency 
        prices and associated stats may vary. Data 
        presented may reflect assets traded on Coinbase’s 
        exchange and select other cryptocurrency exchanges.
      </div>
    </div>
  </section>
</main>
</>

)
}

export default { element: <Explore /> }