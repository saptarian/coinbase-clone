import { Link } from "react-router-dom"
import { isLoggedIn } from '@/lib/server'
import logo from '@/assets/logo.svg'
import Nav from './Nav'

const DASHBOARD_ONLY = true


function Header() {
	const isAuthenticated = isLoggedIn()

	return (
    <header className="border-b sticky top-0 bg-white z-20">
      <div className="flex items-center gap-6 mx-auto h-16
       justify-between px-5 lg:px-10 lg:max-w-screen-xl ">
        <Link to="/" >
          <img src={logo} alt="logo" width="150"/>
        </Link>
        <div className="gap-12 flex items-center min-w-[110px]">
          {DASHBOARD_ONLY ? '' : <Nav />}
            {isAuthenticated ? (
              <Link className="primary-btn-sm w-full" 
                to="/trade">
                Trade
              </Link>
            ) : (
              <div className="flex gap-3 grow">
                <Link className="rounded-btn bg-inherit
                  px-7 py-2 hover:bg-slate-100 text-black
                  ring-1 ring-gray-300 text-sm max-lg:hidden" 
                  to="/signin">Sign In
                </Link>
                <Link className="primary-btn-sm" 
                  to="/signup">Get started
                </Link>
              </div>
            )}
        </div>
      </div>
    </header>
  )
}


export default Header
