import { NavLink, Outlet, useOutletContext } from "react-router-dom"
import logo from '@/assets/logo-coinbase.svg'


export function Settings() {
  const context = useOutletContext()
  
  return (
    <main className="max-w-screen-xl md:py-4
      mx-auto md:px-5 grow w-full">
      <div className="md:container-section flex flex-col min-h-full">
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
     font-medium text-gray-700 sm:px-5 items-center">
      <div className="flex items-center gap-2 py-3 
        max-sm:hidden">
        <img src={logo} className="h-6 pb-[5px]"/>
        <h1>SETTINGS</h1>
      </div>
      <div className="flex gap-3 px-3 py-3">
        <NavLink to="/settings/security_settings" 
          className={({isActive}) => `${
            isActive ? "text-blue-600 ring-blue-300" 
            : "ring-gray-300"
          } ring-1 px-2 py-1 rounded-sm`}>
          Security
        </NavLink>
        <NavLink to="/settings/linked-accounts" 
          className={({isActive}) => `${
            isActive ? "text-blue-600 ring-blue-300" 
            : "ring-gray-300"
          } ring-1 px-2 py-1 rounded-sm`}>
          Payment methods
        </NavLink>
      </div>
    </div>
  )
}
