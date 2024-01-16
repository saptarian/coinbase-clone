import { Link, Form, useLocation, useNavigation } from "react-router-dom"
import Button from '@/components/Button'
import logo from '@/assets/logo-coinbase.svg'


export function Signin() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from") || "/";

  const navigation = useNavigation()
  const isSubmiting = navigation.formData != null

	return (
    <main className="flex flex-col max-w-sm sm:ring-1
      sm:ring-gray-900/10 sm:rounded-2xl gap-4
      mx-auto sm:p-10 sm:mt-8 p-6">
      <div>
        <Link to="/" className="inline-block sm:mb-8 mb-3">
          <img src={logo} alt="logo" width="120"/>
        </Link>
      </div>
      <h1 className="text-2xl">
        <strong>Sign in to Coinbase</strong>
      </h1>
      <p className="text-sm/4 text-slate-500">
        Not your device? Use a private or incognito window to sign in</p>
      <Form method="post" 
        className="mt-4 flex flex-col gap-3" 
        replace noValidate>
        <input type="hidden" name="redirectTo" value={from} />
        <p className="text-sm text-gray-700"> 
          <strong>Email</strong>
        </p>
        <div className="">
          <input 
            className="input-rounded border-gray-500 outline-sky-600"
            type="text" 
            name="email" 
            placeholder="Your email address" 
          />
        </div>
        <p className="text-sm text-gray-700">
          <strong>Password</strong>
        </p>
        <div className="">
          <input 
            className="input-rounded border-gray-500 outline-sky-600"
            type="password" 
            name="password" 
          />
        </div>
        <Button type="submit" 
          isLoading={isSubmiting}>Continue</Button>
        <div className="text-center py-1">
          <p>Don't have an acocunt? <span>
            <Link to="/signup" 
              className="link">Sign up</Link></span>
          </p>
          <a href="#" className="link text-sm underline">
            <small>Privacy policy</small>
          </a>
        </div>
      </Form>
    </main>
	)
}
