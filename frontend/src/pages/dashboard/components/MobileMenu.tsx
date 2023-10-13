import { mobileMenuLinks } from '$/constants'

export default function MobileMenu({includeTradeButton}) {
return (
<menu className="fixed bottom-0 w-full 
  bg-white flex flex-col-reverse md:hidden">
  <div className="flex justify-between px-10
   text-sm font-medium border-t py-3">
    {mobileMenuLinks.map(menu => (
      <MenuItem
        key={menu.label}
        label={menu.label}
        path={menu.path}
        icon={menu.icon}
      />  
    ))}
  </div>
  {includeTradeButton && (
    <div className="p-3 w-full">
      <button className="primary-btn">Trade</button>
    </div>
  )}
</menu>
)
}

const MenuItem = ({label, path, icon}) => (
<a href={path} className="flex flex-col 
items-center gap-1 text-gray-600 hover:text-inherit">
  {icon ? (
    <div className="h-5 w-5">
      <img src={icon} alt={label} />
    </div>
  ) : (
    <div className="h-5 w-5 bg-gray-300"></div>
  )}
  <h6 className="">{label}</h6>
</a>  
)

