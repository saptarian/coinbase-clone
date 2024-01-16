import { MenuIconedItem } from "@/constants"
import { Link, NavLink } from "react-router-dom"


const Sidebar: React.FC<{
  navItems: Array<MenuIconedItem>
}> = ({navItems}) =>
{
  return (
    <aside className="w-[75px] xl:w-[220px]
      md:block hidden bg-white shrink-0 h-screen">
      <div className="fixed z-20">
        <div className="flex flex-col gap-0 py-0 px-0 h-screen
          w-[75px] xl:w-[220px]">
          <SmallLogo />
          <div className="overflow-y-auto grow">
            <div className="py-2 space-y-3 xl:space-y-1 px-3">
              {navItems.map(({label, path, icon}) => (
                <MenuItem 
                  key={label}
                  path={path} 
                  label={label}
                  icon={icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}


const MenuItem: React.FC<MenuIconedItem> = (
  {path, label, icon: Icon}
) => 
(
  <NavLink to={path} title={label}
    className={({ isActive }) => 
    `flex xl:w-full w-fit items-center mx-auto font-medium p-3 ${
      isActive 
      ? "text-blue-600 bg-blue-50" : "text-gray-700"
    } rounded-full hover:bg-blue-50 hover:text-blue-600 xl:p-4`
  }>
    <Icon className="w-5 h-5" />
    <h2 className="max-xl:hidden ml-3 truncate">{label}</h2>
  </NavLink>
)


const SmallLogo = () => {
  return (
    <div className="hidden md:block px-5 py-5">
      <Link to="/home">
        <div className="rounded-full w-8 h-8 
          border-[7px] border-blue-600">
        </div>
      </Link>
    </div>
  )
}


export default Sidebar
