import { Link, LinkProps } from "react-router-dom"
import CoinList from './CoinList'
import Modal from '@/components/Modal'
import BuySellPanel from './BuySellPanel'
import { useDashboard } from '@/lib/context'
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
  const { user, from, slug, identity, avatar } = useDashboard()

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
          <div className="max-md:hidden">
            {showSearch ? (
              <Modal className="w-[380px] bg-white shadow
                rounded-sm mx-auto mt-12"
                hideClose
                trigger={({setOpen}) => (
                  <div className="relative">
                    <span className="absolute px-4 z-10 top-3">
                      <SearchLoop className="w-3.5" />
                    </span>
                    <input type="text" 
                      onFocus={() => setOpen(true)}
                      placeholder="Search for an asset" 
                      className="pl-12 rounded-full pr-7 py-2 text-sm
                      bg-stone-100/75 font-medium border-stone-400/75
                      placeholder:text-stone-400" 
                    />
                  </div>
                )}>
                {({open, setOpen}) => open ? (
                  <SearchBox onClose={() => setOpen(false)}>
                    {({search, onClose: setClose}) => (
                      <CoinSearcher options={{search}}>
                        {({coins, isLoading}) => (
                          <div className="max-sm:h-full h-96"
                            onClick={setClose}>
                            <CoinList 
                              coins={coins} 
                              isLoading={isLoading}
                            />
                          </div>
                        )}
                      </CoinSearcher>
                    )}
                  </SearchBox>
                ) : ''}
              </Modal>
            ) : ''}
          </div>
          <div className="max-md:hidden min-w-[8rem]">
            <Modal className="w-[320px] bg-white shadow
              rounded-sm mx-auto mt-12"
              trigger={
                <button className="primary-btn-sm w-full">
                  Buy & Sell
                </button>
              }>
              {({open, setOpen}) => open ? (
                <BuySellPanel 
                  onDone={() => setOpen(false)}
                  assetSlug={slug}
                  isUserVerified={identity?.verified}
                />
              ) : ''}
            </Modal>
          </div>
          <div className="flex gap-2">
            {showSearch ? (
              <Modal className="w-[380px] bg-white shadow
                rounded-sm mx-auto mt-12"
                hideClose
                trigger={
                  <button className="w-9 h-9 bg-stone-100/50 flex 
                    rounded-full items-center justify-center
                    hover:bg-stone-200 md:hidden">
                    <SearchLoop strokeWidth="2"
                      className="w-4"
                    />
                  </button>
                }>
                {({open, setOpen}) => open ? (
                  <SearchBox onClose={() => setOpen(false)}>
                    {({search, onClose: setClose}) => (
                      <CoinSearcher options={{search}}>
                        {({coins, isLoading}) => (
                          <div className="max-sm:h-full h-96"
                            onClick={setClose}>
                            <CoinList 
                              coins={coins} 
                              isLoading={isLoading}
                            />
                          </div>
                        )}
                      </CoinSearcher>
                    )}
                  </SearchBox>
                ) : ''}
              </Modal>
            ) : ''}
            <Modal className="w-[320px] bg-white shadow
              rounded-sm ml-auto mr-5 mt-12"
              trigger={
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
              {({setOpen}) => (
                <UserMenu onClickLink={() => {
                  setOpen(false)
                }} user={user} avatar={avatar} />
              )}
            </Modal>
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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
