import React from 'react'
import { Link, LinkProps, useLocation } from "react-router-dom"
import CoinList from './CoinList'
import Portal from '@/components/Portal'
import BuySellPanel from './BuySellPanel'
import { useDashboard } from '@/lib/context'
import { useDebounce } from '@/lib/hooks'
import SignoutButton from '@/components/SignoutButton'
import SearchBox, { CoinSearcher } from '@/components/SearchBox'
import { UserCircle, SearchLoop, ArrowLeft } from '@/components/Icons'
import { User } from "@/types"


const Headbar: React.FC<{
    title?: string
    showSearch: boolean
    showGoBack: boolean
}> = ({title, showSearch, showGoBack}) => 
{
  const [search, setSearch] = React.useState('')
  const debouncedSearch = useDebounce(search)
  const [show, setShow] = React.useState(false)
  const location = useLocation()
  const { user, from, slug, identity, avatar } = useDashboard()

  React.useEffect(() => {setShow(false)}, [location])

  return (
    <header className="bg-white sticky z-20 top-0 border-b">
      <nav className="flex h-12 md:h-14 items-center px-5">
        <div className="grow flex gap-4 items-center">
          <Link to="/home" className="md:hidden">
            <div className="rounded-full w-7 h-7 
              border-[7px] border-blue-600">
            </div>
          </Link>
          {showGoBack ? (
            <Link to={from ?? '/home'}>
              <ArrowLeft className="rounded-full 
                w-7 h-7 p-2 text-gray-700
                bg-gray-200/75 hover:bg-gray-200"/>
            </Link>
          ) : ''}
          {title ? (
            <h1 className="font-medium text-lg">{title}</h1>
          ) : ''}
        </div>
        <div className="flex items-center gap-6">
          {showSearch ? (
            <div className="max-md:hidden relative w-[300px]">
              <div className="relative w-full z-20 px-2">
                <span className="absolute px-4 z-10 top-3">
                  <SearchLoop className="w-3.5" />
                </span>
                <input type="search" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => {setShow(true)}}
                  // onBlur={() => {setShow(false)}}
                  placeholder="Search for an asset" 
                  className="pl-10 rounded-full pr-4 py-2 text-sm
                  bg-stone-100/75 font-medium border-stone-400/75
                  placeholder:text-stone-400 w-full h-[38px]" 
                />
              </div>
              {show ? (<>
                <div className="fixed inset-0"
                  onClick={() => setShow(false)}
                ></div>
                <div className="absolute z-10 bg-white w-full
                  h-[calc(100vh-80px)] shadow-2xl rounded-lg 
                  -top-[4px] ring-1 ring-gray-200 ">
                </div>
                <div className="absolute z-10 w-full
                  overflow-y-auto h-[calc(100vh-120px)]"
                  onClick={(e) => {e.stopPropagation()}}
                >
                  <CoinSearcher 
                    options={{search: debouncedSearch}}>
                    {({coins, isLoading}) => (
                      <CoinList 
                        coins={coins} 
                        isLoading={isLoading}
                      />
                    )}
                  </CoinSearcher>
                </div>
              </>) : ''}
              
              {/*<Portal className="w-[380px] ml-auto 
                mr-auto lg:mr-[250px] mt-[40px]"
                ignoreFreeze trigger={({handleOpen}) => (
                  <div className="relative">
                    <span className="absolute px-4 z-10 top-3">
                      <SearchLoop className="w-3.5" />
                    </span>
                    <input type="text" 
                      onFocus={handleOpen}
                      placeholder="Search for an asset" 
                      className="pl-12 rounded-full pr-7 py-2 text-sm
                      bg-stone-100/75 font-medium border-stone-400/75
                      placeholder:text-stone-400" 
                    />
                  </div>
                )}>
                {({open, handleClose}) => open ? (
                  <div className={`h-[calc(100vh-80px)]`}>
                    <SearchBox onClose={handleClose}>
                      {({search, onClose: setClose}) => (
                        <CoinSearcher options={{search}}>
                          {({coins, isLoading}) => (
                            <CoinList 
                              coins={coins} 
                              isLoading={isLoading}
                            />
                          )}
                        </CoinSearcher>
                      )}
                    </SearchBox>
                  </div>
                ) : ''}
              </Portal>*/}
            </div>
          ) : ''}
          <div className="max-sm:hidden min-w-[8rem]">
            <Portal className="w-[320px] ml-auto mr-[100px] mt-12"
              ignoreDark ignoreFreeze trigger={
                <button className="primary-btn-sm w-full">
                  Buy & Sell
                </button>
              }>
              {({open, handleClose}) => open ? (
                <BuySellPanel 
                  onDone={handleClose}
                  assetSlug={slug}
                  isUserVerified={identity?.verified}
                />
              ) : ''}
            </Portal>
          </div>
          <div className="flex gap-2">
            {showSearch ? (
              <Portal className="sm:w-[380px] ml-auto 
                mr-auto sm:mr-[40px] sm:mt-[40px] w-full"
                ignoreDark ignoreFreeze trigger={
                  <button className="w-9 h-9 bg-stone-100/50 flex 
                    rounded-full items-center justify-center
                    hover:bg-stone-200 md:hidden">
                    <SearchLoop strokeWidth="2"
                      className="w-4"
                    />
                  </button>
                }>
                {({open, handleClose}) => open ? (
                  <div className="sm:h-[calc(100vh-80px)] h-screen">
                    <SearchBox onClose={handleClose}>
                      {({search}) => (
                        <CoinSearcher options={{search}}>
                          {({coins, isLoading}) => (
                            <CoinList 
                              coins={coins} 
                              isLoading={isLoading}
                            />
                          )}
                        </CoinSearcher>
                      )}
                    </SearchBox>
                  </div>
                ) : ''}
              </Portal>
            ) : ''}
            <Portal className="w-[320px] ml-auto mr-5 mt-12"
              ignoreDark ignoreFreeze trigger={
                <button className="w-9 h-9 bg-stone-100/50 flex 
                  rounded-full items-center justify-center
                  hover:bg-stone-200 overflow-hidden">
                  {avatar ? (
                    <img src={avatar} 
                      className="w-full" />
                  ) : (
                    <UserCircle strokeWidth="1.6"
                      className="w-5"
                    />
                  )}
                </button>
              }>
              {({handleClose}) => (
                <UserMenu onClickLink={handleClose} 
                  user={user} avatar={avatar} />
              )}
            </Portal>
          </div>
          {/*<div className="hidden">
            <HamburgerIcon />
          </div>*/}
        </div>
      </nav>
    </header>
  )
}


const UserMenu = ({user, onClickLink, avatar}: {
  user: User
  onClickLink: () => void
  avatar?: string
}) =>
{
  const MyLink: React.FC<LinkProps & 
    React.RefAttributes<HTMLAnchorElement>
  > = ({children, ...props}) => (
    <Link onClick={onClickLink} {...props}>
      {children}
    </Link>
  )

  return (
    <div className="divide-y">
      <div className="flex gap-3 items-center p-4">
        <MyLink to="/profile" className="shrink-0 w-14
          rounded-full overflow-hidden">
          {avatar ? (
            <img src={avatar} 
              className="w-full" />
          ) : (
            <UserCircle strokeWidth="1.8"
              className="text-gray-500/50 
              hover:text-gray-600/50"/>
          )}
        </MyLink>
        <div className="leading-5 min-w-[9rem] grow">
          <h2 className="font-medium text-lg truncate">
            {user.display_name || 
            user.first_name + " " + user.last_name}
          </h2>
          <p className="truncate pb-1.5">
            {user.email}
          </p>
          <MyLink to="/profile" className="font-medium
            text-sm text-gray-600 hover:text-gray-800
            px-3 py-0.5 ring-1 ring-gray-300 rounded-sm
            hover:ring-inherit ">
            Manage profile
          </MyLink>
        </div>
        <MyLink to="/profile" className="shrink-0 w-8">
          <ArrowLeft className="hover:text-stone-400
            text-stone-200"/>
        </MyLink>
      </div>
      <div className="font-medium space-y-3 p-4">
        <MyLink to="/settings"
          className="flex gap-3 items-center w-fit
          hover:text-blue-600">
          <UserCircle className="w-4 h-4"/>
          <h3> Settings </h3>
        </MyLink>
        <a href="https://google.com" 
          target="_blank"
          className="flex gap-3 items-center w-fit
          hover:text-blue-600">
          <UserCircle className="w-4 h-4"/>
          <h3> Get Supports </h3>
        </a>
        <SignoutButton
          className="text-red-800
          flex gap-3 items-center hover:text-red-600">
          <ArrowLeft className="w-4 h-4"/>
          <h3> Sign out </h3>
        </SignoutButton>
      </div>
    </div>
  )
}


// const HamburgerIcon = () => (
//   <div className="w-7 h-7 bg-gray-200/75 rounded-full 
//     ring-1 ring-gray-300 flex flex-col space-y-[3px]
//     items-center justify-center cursor-pointer">
//     <div className="bg-gray-500 w-3 h-[2px]"></div>
//     <div className="bg-gray-500 w-3 h-[2px]"></div>
//     <div className="bg-gray-500 w-3 h-[2px]"></div>
//   </div>
// )


export default Headbar
