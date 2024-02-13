import Header from '@/components/Header'
import { Outlet, redirect } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom"

import { signin, isLoggedIn, validateIdentity, signup } from '@/lib/server'
import { isValidEmail } from '@/lib/validation'
import { SignupValues } from '@/types'
import {NotFound} from '@/pages/NotFound'


export const RootRoutes = [
  { 
    element: ( <> <Header /> <Outlet /> </> ),
    children: [
      { 
        index: true, 
        async lazy() {
          const { Explore } = await import('../pages/Explore')
          return { element: <Explore/> }
        },
      },
      { 
        path: "*", 
        loader: loaderNotFound,
        action: actionNotFound,
        element: <NotFound/>
      },
    ]
  },
  { 
    path: "signin", 
    loader: loaderSignin,
    action: actionSignin,
    async lazy() {
      const { Signin } = await import('../pages/Signin')
      return { element: <Signin/> }
    },
  },
  { 
    path: "signup", 
    loader: loaderSignup,
    action: actionSignup,
    async lazy() {
      const { Signup } = await import('../pages/Signup')
      return { element: <Signup/> }
    },
  },
]


function loaderNotFound() {
  // console.log('*404:', params["*"])
  return { ok: true }
}


function actionNotFound() {
  // console.log('*404:', request)
  return { ok: true }
}


function loaderSignin() {
  if (isLoggedIn())
    return redirect("/home")

  return {ok: true}
}


async function actionSignin({ request }: LoaderFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get("email") as string | null
  const password = formData.get("password") as string | null
  const id = 'action'

  if (!email || !password) {
    toast("Email and password are required", {id})
    return { ok: false }
  }

  if (!isValidEmail(email)) {
    toast("Use a valid email address", {id})
    return { ok: false }
  }

  type Tuple = [boolean, null | (() => Response)]
  const [ok, func]: Tuple = await signin({email, password})
  .then(() => validateIdentity())
  .then((resp): Tuple => {
    if (resp.status == 202) 
      return [false, () => redirect("/setup/phone")]

    return [true,null]
  })
  .catch((err) => {
    toast(err.message, {id})
    return [false,null]
  })
  
  if (!ok) return typeof func === 'function' ? func() : {ok}

  const redirectTo = formData.get("redirectTo") as string | null
  return redirect(redirectTo || "/home")
}


function loaderSignup() {
  if (isLoggedIn())
    return redirect("/home")

  return {ok: true}
}


async function actionSignup({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(
    await request.formData()
  ) as SignupValues
  const id = 'action'

  const {ok} = await signup(formData)
  .then(() => ({ok: true}))
  .catch((err) => {
    toast(err.message, {id})
    return {ok:false}
  })

  return ok ? redirect("/setup/phone") : {ok}
}