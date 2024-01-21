import { NavLink } from "react-router-dom"
import { MenuIconedItem, mobileMenuLinks } from '@/constants'
import { useDashboard } from "@/lib/context"
import BuySellPanel from './BuySellPanel'
import Modal from '@/components/Modal'
import React from "react"


const MobileMenu: React.FC<{
  showTradeButton: boolean
}> = ({showTradeButton}) =>
{
  const { identity, slug } = useDashboard()

  return (
    <menu className="sticky z-20 bottom-0 w-full 
      bg-white flex flex-col-reverse md:hidden">
      <div className="border-t py-1">
        <div className="flex gap-2 justify-between mx-auto 
          max-w-sm">
          {mobileMenuLinks.map(({label, path, icon}) => (
            <MenuItem
              key={label}
              label={label}
              path={path}
              icon={icon}
            />  
          ))}
        </div>
      </div>

      {showTradeButton ? (
        <Modal className="w-[320px] bg-white shadow
          rounded-sm mx-auto mt-16"
          trigger={(
            <div className="p-3 w-full">
              <button className="primary-btn w-full">
                Buy & Sell
              </button>
            </div>
          )}>
          {({open, setOpen}) => open ? (
            <BuySellPanel 
              onDone={() => setOpen(false)}
              assetSlug={slug}
              isUserVerified={identity?.verified}
            />
          ) : ''}
        </Modal>
      ) : ''}
    </menu>
  )
}


const MenuItem: React.FC<MenuIconedItem> = (
  {label, path, icon: Icon}) => 
{
  return (
    <NavLink to={path} 
      className={
      ({isActive}) => `flex flex-col py-2 px-3 text-sm ${
        isActive ? "text-blue-600" : "text-gray-700"
      } font-medium items-center gap-1 hover:text-blue-700`
    }>
      <Icon className="w-4 h-4"/>
      <h6 className="">{label}</h6>
    </NavLink> 
  ) 
}


export default MobileMenu