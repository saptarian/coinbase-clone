export function AssetOverview() {
	return (
		<>
      <menu className="fixed bottom-0 w-full
      bg-white flex flex-col-reverse">
        <div className="flex justify-between px-10
         text-sm font-medium text-gray-600
         border-t  py-3">
          <a href="#" className="flex flex-col 
          items-center gap-1">
            <div className="h-5 w-5 bg-gray-300"></div>
            <h6 className="">Home</h6>
          </a>  
          <a href="#" className="flex flex-col 
          items-center gap-1">
            <div className="h-5 w-5 bg-gray-300"></div>
            <h6 className="">Assets</h6>
          </a>  
          <a href="#" className="flex flex-col 
          items-center gap-1">
            <div className="h-5 w-5 bg-gray-300"></div>
            <h6 className="">Trade</h6>
          </a>  
          <a href="#" className="flex flex-col 
          items-center gap-1">
            <div className="h-5 w-5 bg-gray-300"></div>
            <h6 className="">Earn</h6>
          </a>  
        </div>
        <div className="p-3 w-full ">
          <button className=" w-full
          rounded-full bg-blue-600 text-white
          py-3 font-medium">Trade</button>
        </div>
      </menu>

      <main className="mb-40">
        <header className="">
          <div className="flex items-center gap-2 font-medium
          py-3 px-5">
            <div className="w-9 h-9 bg-yellow-600 rounded-full
            text-center text-white font-medium mr-3
            text-2xl">B</div>
            <h1 className="text-2xl">Bitcoin</h1>
            <h2 className="text-gray-500 text-xl">BTC</h2>
          </div>
        </header>
        <nav className="py-3">
          <div className="flex gap-5 font-medium border-b
           px-5">
            <div className="space-y-1">
              <button className="text-gray-800 px-2
              ">Overview</button>
              <div className="bg-gray-800 h-[2px]"></div>
            </div>
            <div className="space-y-1">
              <button className="text-gray-500 px-2
              ">Primary balance</button>
              <div className="bg-gray-800 h-[2px]
              hidden"></div>
            </div>
          </div>
          <hr className="" />
        </nav>

        <div className="border-gray-400">
          <div className="font-medium border-b 
          px-5 py-3">
            <h3 className="text-gray-600">My cash</h3>
            <h3 className="">$0.00</h3>
          </div>
          <table className="w-full">
            <thead className="text-gray-600 border-b
            text-left">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Total balance</th>
            </thead>
            <tbody className="">
              <tr className="border-b">
                <td className="px-5 py-3 flex items-center
                gap-2">
                  <div className="bg-blue-600 rounded-full
                  w-7 h-7"></div>
                  <p className="">Euro</p>
                </td>
                <td className="px-5 py-3">$0.00
                </td>
                <td className="">
                  <button className="pr-1 space-y-[2px]">
                    <div className="bg-gray-800 rounded-full
                    w-[3px] h-[3px]"></div>
                    <div className="bg-gray-800 rounded-full
                    w-[3px] h-[3px]"></div>
                    <div className="bg-gray-800 rounded-full
                    w-[3px] h-[3px]"></div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="font-medium border-b 
           px-5 py-3">
            <h3 className="text-gray-600">My cash</h3>
            <h3 className="">$0.00</h3>
          </div>

          <div className="text-center px-5 py-10 border-b">
            <div className=""></div>
            <h2 className="text-xl font-medium
            ">Get started with crypto</h2>
            <p className="text-gray-700 py-2
            ">Your crypto assets will appear here.</p>
            <button className="bg-slate-200 px-8 py-2
            font-medium rounded-full mt-3 mb-7
            ">Explore assets</button>
          </div>
        </div>

        <div className="">
          <div className="px-5 py-2 space-y-5">
            <h3 className="font-medium text-gray-500
            ">Balance: 0 USDT ($0.00)</h3>
            <div className="flex gap-4
            ">
              <button className="bg-blue-600 rounded-full
              py-3 px-5 text-white font-medium basis-1/2
              ">Send</button>
              <button className="bg-blue-600 rounded-full
              py-3 px-5 text-white font-medium basis-1/2
              ">Receive</button>
            </div>
            <div className="">
              <p className="font-medium text-gray-700
              text-xs">0 USDT</p>
              <h2 className="text-2xl font-medium">$0.00</h2>
            </div>
          </div>
          <div className="text-center space-y-5
          border-y  py-5">
            <div className=""></div>
            <h3 className="text-lg font-medium
            ">No Transactions</h3>
            <p className="text-gray-700 pb-3 px-5
            ">Looks like there isn't any ETH 
            in your account yet. Coinbase is the easiest
            place to get satrted.</p>
            <button className="bg-blue-600 rounded-full
            text-white px-8 py-3 font-medium
            ">Buy Ethereum</button>
          </div>
        </div>

        <footer className="mx-auto flex flex-col
        items-center gap-3">
          <div className="text-sm flex gap-5 text-sky-600
          justify-center border-b p-3 w-full">
            <a href="#" className="">Home</a>
            <a href="#" className="">Careers</a>
            <a href="#" className="">Legal & Privacy</a>
          </div>
          <div className="">
            <select name="language" className="w-24 px-2 py-1
            text-xs block ring-1 ring-gray-400 w-40">
              <option value="" className="">English</option>
            </select>
          </div>
          <a href="#" className="rounded-sm px-2 py-1 block
          bg-blue-600 text-xs text-white font-medium
          ">Need help</a>
          <small className="text-gray-600">2023 Coinbase</small>
        </footer>

        <div className="">
          <div className="flex gap-2 px-5 py-3">
            <h3 className="text-2xl
            ">$24,410.72</h3>
            <h4 className="text-green-600">+1.58%</h4>
          </div>
          <div className="w-full h-28 bg-slate-200
          ">Chart</div>
          <div className="px-5 py-3">
            <h5 className="font-medium">Market stats</h5>
            <div className="flex justify-between pt-3 pb-7">
              <div className="">
                <p className="">Market cap</p>
              </div>
              <div className="">
                <p className="">$476.0B</p>
              </div>
            </div>
            <div className="flex justify-between pt-3 pb-7">
              <div className="">
                <p className="leading-3">Volume (24h)</p>
                <small className="text-red-600 text-xs
                ">+6.48%</small>
              </div>
              <div className="">
                <p className="">$11.8B</p>
              </div>
            </div>
            <div className="flex justify-between pt-3 pb-7">
              <div className="">
                <p className="leading-3
                ">Circulating supply</p>
                <small className="text-xs
                ">93% of total supply</small>
              </div>
              <div className="">
                <p className="">19.5M <span className="">BTC</span></p>
              </div>
            </div>
            <div className="flex justify-between pt-3 pb-7">
              <div className="">
                <p className="">Trading activity</p>
              </div>
              <div className="text-right">
                <p className="leading-3">99% buy</p>
                <small className="text-xs">1% sell</small>
              </div>
            </div>
            <div className="flex justify-between pt-3 pb-7">
              <div className="">
                <p className="">Popularity</p>
              </div>
              <div className="">
                <p className="">#1</p>
              </div>
            </div>
            <div className="flex justify-between pt-3 pb-7">
              <div className="">
                <p className="">Performance</p>
              </div>
            </div>
            <div className="flex gap-8 justify-center">
              <p className="">Past year</p>
              <div className="flex flex-col">
                <small className="text-xs text-gray-600
                ">Bitcoin</small>
                <span className="text-sm">+35%</span>
              </div>
              <div className="flex flex-col">
                <small className="text-xs text-gray-600
                ">Market</small>
                <span className="text-sm">+9%</span>
              </div>
            </div>
          </div>

          <article className="px-5 py-3">
            <h2 className="text-2xl font-medium py-2">
              Overview
            </h2>
            <p className="py-5 text-gray-800">
              Ethereum is a decentralized computing platform
              that uses ETH (also called Ether) to pay 
              transactions fees (or "gas"). Developers can
              user Ethereum to run decentralized
              applications (dApps) and issue new crypto assets,
              known as Ethereum tokens.
            </p>
            <h3 className="font-medium text-gray-600">RESOURCES</h3>
            <div className="py-2 text-sky-600 flex flex-col
            gap-3">
              <a href="#" className="">Whitepaper</a>
              <a href="#" className="">Official website</a>
            </div>
            <h3 className="font-medium text-gray-600">APY</h3>
            <p className="py-4 text-sm
            ">It's based on the ETH staking rewards
            generated.</p>
            <a href="#" className="text-sky-600 ">Learn more</a>
          </article>

          <section className="border-t ">
            <div className="px-5 py-3">
              <h2 className="font-medium text-lg
              ">Price colleration with</h2>
              <a href="#" className="flex gap-3 py-3
              justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-7 h-7 bg-gray-300
                  rounded-full"></div>
                  <div className="leading-5">
                    <h3 className="font-medium
                    ">Wrapped Bitcoin</h3>
                    <p className="text-gray-700
                    ">Moves tightly together</p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-gray-700 font-medium
                  ">$24,429,82</h4>
                  <p className="text-sm text-gray-700">98%</p>
                </div>
              </a>
            </div>
          </section>
        </div>
      </main>

    </>
	)
}