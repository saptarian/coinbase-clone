import * as React from 'react'
import { 
  Outlet, 
  redirect,  
} from 'react-router-dom'
import {
  Footer,
  Headbar,
  Sidebar,
  MobileMenu, 
} from './components'
import { updateAuth } from 'lib/storage'
import { validateIdentity } from 'lib/auth'
import { isTokenExpired } from 'lib/validation'


const loader = async ({ request }: LoaderFunctionArgs) => {
  const redirectWithFrom = () => {
    let params = new URLSearchParams()
    params.set("from", new URL(request.url).pathname)
    return redirect('/signin?' + params.toString())
  }

  try {
    let data = await validateIdentity()
    // redirect if identity was not created
    if (data.status == 202) 
      return redirect("/setup/phone")

    return { ok: true }
  }
  catch (error) {
    if (401 == error.status || 422 == error.status) {
      updateAuth(null)
      return redirectWithFrom()
    }
    console.warn(error)
    return { error, ok: false }
  }
}

function DashboardLayout() {

  return (
    <div className="md:flex">
      <MobileMenu />
      <Sidebar />
      <div className="min-h-screen md:bg-slate-100 
        w-full overflow-y-auto">
        <Headbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}

export default { 
  loader,
  element: <DashboardLayout /> 
}
