import { sidebarLinks } from '$/constants'

export default function Sidebar() {
return (
<aside className="xl:w-[250px] border-r
hidden md:block min-h-screen min-w-[75px] xl:min-w-[200px]">
  <div className="fixed left-0">
    <div className="flex flex-col gap-5 py-6 px-3 max-w-[180px]">
      <div className="hidden md:block px-3">
        <a href="#">
          <div className="rounded-full w-8 h-8 
            border-[7px] border-blue-600">
          </div>
        </a>
      </div>
      <div className="fixed top-20 bottom-0 overflow-y-auto">
        <div className="py-2 space-y-2 max-w-[180px]">
          {sidebarLinks.map(menu => (
            <MenuItem 
              key={menu.label}
              path={menu.path} 
              label={menu.label}
              icon={menu.icon}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
</aside>
)
}

const MenuItem = ({path, label, icon}) => (
<a href={path} className="flex items-center gap-2
 py-3 px-3 rounded-full hover:bg-blue-50 text-black">
 { icon ? (
  <div className="w-6 h-6 rounded-full">
    <img src={icon} alt="icon" />
  </div>
  ) : (
  <div className="w-6 h-6 bg-slate-300 rounded-full">
  </div>
  )}
  <h2 className="max-xl:hidden">{label}</h2>
</a>
)