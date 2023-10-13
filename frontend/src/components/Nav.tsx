import logo from '$/assets/logo-coinbase.svg'
import { navLinks } from '$/constants'

function Nav({isAuthenticated} : {isAuthenticated: boolean}) {
  return (
    <header className="border-b sticky top-0 bg-white">
      <div className="flex items-center gap-6 mx-auto
       justify-between px-6 py-4 lg:max-w-6xl ">
        <a href="/" >
          <img src={logo} alt="logo" width="100"/>
        </a>
        <div className="gap-12 flex items-center">
          <nav className="gap-6 font-medium grow shrink-0
            max-lg:hidden flex flex-row justify-end">
            {navLinks.map(item => 
              <div key={item.label}>
                <a href={item.href} 
                  className="hover:border-b-2 py-6 border-gray-800">
                  {item.label}
                </a>
              </div>
            )}
          </nav>
          <div className="flex gap-3">
            {isAuthenticated 
              ? (
                <a className="primary-btn-sm" href="/trade">Trade
                </a>
                ) 
              : (<>
                  <a className="rounded-btn bg-inherit text-gray-900
                    px-7 py-2 hover:bg-slate-100 text-black
                    ring-1 ring-gray-300 text-sm max-lg:hidden" 
                    href="/signin">Sign In
                  </a>
                  <a className="primary-btn-sm" 
                    href="/signup">Get started
                  </a>
                </>
                )
            }
          </div>
          <button className="space-y-1 lg:hidden">
            <div className="bg-gray-600 h-[2px] w-4"></div>
            <div className="bg-gray-600 h-[2px] w-4"></div>
            <div className="bg-gray-600 h-[2px] w-4"></div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Nav