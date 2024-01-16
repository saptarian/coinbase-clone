import { NavLink, NavLinkProps } from "react-router-dom"
import Skeleton from 'react-loading-skeleton'
import { SmallAssetDisplay } from "@/types"


const InnerPageHeader: React.FC<Partial<SmallAssetDisplay>> = (
  {logo, name, symbol, slug}
) =>
{
  return (
    <>
      <header>
        <div className="flex items-center gap-2 font-medium
          py-3 px-5">
          <span className="w-8 h-8 rounded-full">
            {logo ? (
              <img src={logo} /> 
            ) : <Skeleton circle height="28px" width="28px"  />}
          </span>
          <h1 className="text-3xl pl-3">
            {name || <Skeleton width="10rem" />}
          </h1>
          <h2 className="text-gray-400 text-xl pt-2">
            {symbol || <Skeleton width="3rem" />}
          </h2>
        </div>
      </header>
      <InnerPageNavigation slug={slug} />
    </>
  )
}


const InnerPageNavigation = ({slug}: {
  slug?: string
}) => 
{
  return (
    <nav className="py-3">
      <div className="flex gap-5 font-medium border-b px-5">
        <NavItem to={slug ? "/price/" + slug : "/trade"}>
          Overview
        </NavItem>
        <NavItem to={slug ? "/accounts/" + slug : "/home"}>
          Primary balance
        </NavItem>
      </div>
    </nav>
  )
}


const NavItem: React.FC<NavLinkProps & React.RefAttributes<
  HTMLAnchorElement
>> = ({to, children}) => 
(
  <NavLink to={to} className={({ isActive }) => 
    `border-gray-800 hover:border-b-2 text-gray-500 ${
      isActive 
      ? "border-b-2 text-gray-800" : ""
    } hover:text-gray-800 px-2 py-2`}>
    {children}
  </NavLink>
)

export default InnerPageHeader
