import { NavLink, Outlet, useOutletContext } from "react-router-dom"
import logo from '@/assets/logo.svg'


export function Profile() {
  const context = useOutletContext()
  
  return (
    <main className="max-w-screen-xl md:py-4
      mx-auto md:px-5 grow w-full">
      <div className="md:container-section">
        <SubHeaderMenu />
        <hr />
        <Outlet context={context} />
      </div>
    </main>
  )
}


const SubHeaderMenu = () => {
  return (
    <div className="flex flex-row gap-5
     font-medium text-gray-700 px-5 items-center">
      <div className="flex items-center gap-2 py-3 pr-3
       max-sm:hidden">
        <img src={logo} className="h-6 pb-[5px]"/>
        <h1>ACCOUNT</h1>
      </div>
      <div className="flex gap-3 pr-3 py-3">
        <NavLink to="/profile" 
          className={({isActive}) => `${
            isActive ? "text-blue-600 ring-blue-300" 
            : "ring-gray-300"
          } ring-1 px-2 py-1 rounded-sm`}>
          Profile
        </NavLink>
        <NavLink to="/transactions" 
          className={({isActive}) => `${
            isActive ? "text-blue-600 ring-blue-300" 
            : "ring-gray-300"
          } ring-1 px-2 py-1 rounded-sm`}>
          Transactions
        </NavLink>
      </div>
    </div>
  )
}
