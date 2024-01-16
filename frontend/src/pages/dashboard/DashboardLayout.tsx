import React from 'react'
import { 
  Outlet, 
  useParams,
  useLocation,
  useLoaderData,
  ScrollRestoration,
} from 'react-router-dom'

import Footer from './components/Footer'
import Headbar from './components/Headbar'
import Sidebar from './components/Sidebar'
import MobileMenu from './components/MobileMenu'

import { UserDataRequired } from '@/types'
import { sidebarLinks } from '@/constants'
import { useSessionTimeout } from '@/lib/hooks'
import { DashboardContext, DashboardContextType } from '@/lib/context'
import { storeUser } from '@/lib/storage'
import { fetchAvatar } from '@/lib/server'


const TIME_IDLE = 1000 * 60 * 45 // 45 Minutes

const addtionalTitle = [
  { path: "/profile", label: "Profile" },
  { path: "/transactions", label: "Transactions" },
  { path: "/settings", label: "Settings" },
]

export function DashboardLayout() 
{
  const userData = useLoaderData() as UserDataRequired
  const [avatar, setAvatar] = 
    React.useState(userData.avatar)
  const {name: slug} = useParams<'name'>()
  useSessionTimeout(TIME_IDLE)

  const {pathname} = useLocation()
  const [from, setFrom] = React.useState('/trade')

  const navItem = [
    ...sidebarLinks, 
    ...addtionalTitle
  ].find(({path}) => 
    pathname.startsWith(path))

  React.useEffect(() => {
    if (!isAssetViewPage(pathname)) {
      setFrom(pathname)
    }
  }, [pathname])

  const context: DashboardContextType = 
    {from, slug, pathname, avatar, ...userData}
  // console.log('DashboardLayout.render', context)

  React.useEffect(() => {
    if (userData.user.photo_url && !avatar) {
      fetchAvatar().then((resp) => {
        const blob = new Blob([resp.data],{type: 'image/png'})
        if (blob.size >= 1024) {
          const reader = new FileReader
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              storeUser({avatar: reader.result})
              setAvatar(reader.result)
            }
            // console.log('reader.onload', blob)
          }
          reader.readAsDataURL(blob)
        }
      })
    }
  }, [])


  return (
    <DashboardContext.Provider value={context}>
      <div className="flex flex-col-reverse md:flex-row divide-x">
        <Sidebar navItems={sidebarLinks} />
        <MobileMenu showTradeButton={
          isAssetViewPage(pathname)
        }/>
        <div className="md:bg-slate-100 min-h-screen md:grow 
          flex flex-col overflow-x-hidden">
          <Headbar 
            showGoBack={isAssetViewPage(pathname)}
            showSearch={pathname.indexOf('/trade') !== 0} 
            title={navItem?.label}
          />
          {userData.user?.public_id ? (
            <Outlet context={context} />
          ) : ''}
          <Footer />
        </div>
        <ScrollRestoration />
      </div>
    </DashboardContext.Provider>
  )
}


function isAssetViewPage(path: string) {
  return path.indexOf('/price') === 0 || 
         path.indexOf('/accounts') === 0
}
