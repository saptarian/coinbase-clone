import coinbaseLogo from '../assets/logo-coinbase.svg'

function Nav() {

  return (
    <>
      <header className="flex items-center
        px-6 py-4 lg:max-w-6xl gap-6 mx-auto justify-between ">
        <a href="/" className="">
          <img src={coinbaseLogo} alt="coinbase logo" width="100"
            className="" />
        </a>
        <div className="gap-6 flex items-center shrink-0">
          <nav className="gap-6 font-medium grow shrink-0
            max-lg:hidden flex flex-row justify-end"
          >
            <a href="#" className="
              "
            >Explore</a>
            <a href="#" className="
              "
            >Learn</a>
            <a href="#" className="
              "
            >Individuals</a>
            <a href="#" className="
              "
            >Businesses</a>
            <a href="#" className="
              "
            >Developers</a>
            <a href="#" className="
              "
            >Company</a>
          </nav>
          <div className="space-x-3 ml-4
            ">
            <button className="bg-inherit text-gray-900 rounded-full 
              font-medium px-7 py-2 hover:bg-slate-100 text-black
              ring-1 ring-gray-300 text-sm max-lg:hidden">
              <a href="#">Sign In</a>
            </button>
            <button className="bg-blue-600 rounded-full text-white 
              font-medium px-7 py-2 hover:bg-blue-700
              text-sm">
              <a href="#">Get started</a>
            </button>
          </div>
          <button className="space-y-1 lg:hidden">
            <div className="bg-gray-600 h-[2px] w-4
              "
            ></div>
            <div className="bg-gray-600 h-[2px] w-4
              "
            ></div>
            <div className="bg-gray-600 h-[2px] w-4
              "
            ></div>
          </button>
        </div>
      </header>
      <hr />
    </>
  )
}

export default Nav
