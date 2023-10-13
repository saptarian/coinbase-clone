export default function Headbar({showSearch, title}) {
return (
<header className="bg-white sticky top-0 max-md:mb-3">
  <nav className="flex py-2 items-center px-5
    justify-between">
    <div className="flex gap-4 items-center">
      <a href="#" className="md:hidden">
        <div className="rounded-full w-7 h-7 
          border-[7px] border-blue-600">
        </div>
      </a>
      <a href="#" className="max-md:hidden">
        <div className="rounded-full w-7 h-7 
          bg-gray-200/75 px-2">{'<'}
        </div>
      </a>
      <h1 className="font-medium text-lg">{title}</h1>
    </div>
    <div className="flex items-center gap-6">
      <div className="max-md:hidden">
        {showSearch && (
          <input type="text" 
          placeholder="Search for an asset" 
          className="rounded-full px-7 py-2 text-sm
          bg-gray-200/75 font-medium" />
        )}
      </div>
      <div className="lg:flex gap-2 hidden">
        <button className="primary-btn-sm
        ">Buy & Sell</button>
        <button className="secondary-btn-sm
        ">Send & Receive</button>
      </div>
      <div className="flex gap-2">
        <button className="w-7 h-7 bg-gray-200/75
        rounded-full "></button>
        <button className="w-7 h-7 bg-gray-200/75
        rounded-full "></button>
      </div>
      <div className="hidden">
        <HamburgerIcon />
      </div>
    </div>
  </nav>
  <hr />
</header>
)
}

const HamburgerIcon = () => (
<div className="w-7 h-7 bg-gray-200/75 rounded-full 
  ring-1 ring-gray-300 flex flex-col space-y-[3px]
  items-center justify-center cursor-pointer">
  <div className="bg-gray-500 w-3 h-[2px]"></div>
  <div className="bg-gray-500 w-3 h-[2px]"></div>
  <div className="bg-gray-500 w-3 h-[2px]"></div>
</div>
)