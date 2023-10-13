import * as React from 'react'
import type { 
  LoaderFunctionArgs 
} from "react-router-dom";
import { 
  Form,
  redirect,
  useLocation, 
  useNavigation,
  useActionData,
} from "react-router-dom";
import { updateAuth } from 'lib/storage'
import { 
  signin,
  isLoggedIn,
  validateIdentity,
} from 'lib/auth'
import { Button, Input } from '$/components'
import logo from '$/assets/logo-coinbase.svg'


const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData()
  const email = formData.get("email") as string | null
  const password = formData.get("password") as string | null

  if (!email || !password) {
    return {
      erorr: { message: "Please check your input" },
      ok: false,
    }
  }

  try {
    const resp = await signin({email, password})
    updateAuth({token: resp.data?.access_token})
    
    const data = await validateIdentity()
    if (data.status == 202) 
      return redirect("/setup/phone")
  }
  catch (error) {
    return { error, ok: false }
  }

  const redirectTo = formData.get("redirectTo") as string | null
  return redirect(redirectTo || "/trade")
}


function Signin() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from") || "/";

  const actionData = useActionData()
  const navigation = useNavigation()
  const isLoggingIn = navigation.formData != null


	return (
  <main className="flex flex-col max-w-sm sm:ring-1
    sm:ring-gray-900/10 sm:rounded-2xl gap-4
    mx-auto sm:p-10 sm:mt-8 p-6">
    <div>
      <a href="/" className="inline-block sm:mb-8 mb-3">
        <img src={logo} alt="logo" width="120"/>
      </a>
    </div>
    <h1 className="text-2xl">
      <strong>Sign in to Coinbase</strong>
    </h1>
    <p className="text-sm/4 text-slate-500">
      Not your device? Use a private or incognito window to sign in</p>
    <Form method="post" className="mt-4 flex flex-col gap-3" replace>
      <input type="hidden" name="redirectTo" value={from} />
      <p className="text-sm text-gray-700"> 
        <strong>Email</strong>
      </p>
      <div className="">
        <Input type="text" name="email" placeholder="Your email address" required />
      </div>
      <p className="text-sm text-gray-700">
        <strong>Password</strong>
      </p>
      <div className="">
        <Input type="password" name="password" novalidate required />
      </div>
      <Button text="Continue" type="submit" isLoading={isLoggingIn} />
      <div className="text-center py-1">
        <p>Don't have an acocunt? <span>
          <a href="/signup" className="link">Sign up</a></span>
        </p>
        <a href="#" className="link text-sm">
          <small>Privacy policy</small>
        </a>
      </div>
    </Form>
    {actionData?.error && 
      (<div className="bg-red-50 shadow-md rounded-lg border
        text-red-700 text-center py-3 w-full relative">
        {actionData.error.message}
       </div> )}
  </main>
	)
}

export default { 
  loader() {
    if (isLoggedIn())
      return redirect("/trade")

    return {ok: true}
  }, 
  action,
  element: <Signin /> 
}