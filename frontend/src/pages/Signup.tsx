import * as React from 'react'
import type { 
  LoaderFunctionArgs 
} from "react-router-dom"
import { 
  Form,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router-dom'
import { signupForm } from '$/constants'
import { Button, Input } from '$/components'
import { isLoggedIn, signup } from 'lib/auth'

import logo from '$/assets/logo-coinbase.svg'
import signupImg from '$/assets/bitcoinAndOtherCrypto-0.svg'


interface FormInput {
  first_name: string
  last_name: string
  email: string
  password: string
  policy: boolean
}

const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData()

  const first_name = formData.get("first_name")
  const last_name = formData.get("last_name")
  const email = formData.get("email")
  const password = formData.get("password")

  const body = {first_name, last_name, email, password}

  try {
    await signup(body)
  }
  catch (error) {
    return { error, ok: false }
  }

  return redirect("/setup/phone")
}

function validateInput(formInput: FormInput): boolean {
  if (Object.entries(formInput).length != 5)
    return false

  else if (!formInput.policy)
    return false

  else if (Object.values(formInput).some(val => val === ''))
    return false

  // TODO: more validate, isnumber, value length

  return true
}

function Signup() {
  const [formInput, setFormInput] = React.useState<FormInput>({})
  const [canSubmit, setCanSubmit] = React.useState<boolean>(false)
  const [inputError, setInputError] = React.useState<FormInput>({})
  const [showPassword, setShowPassword] = React.useState<FormInput>(false)

  const actionData = useActionData()
  const navigation = useNavigation()
  const isLoading = navigation.formData != null

  function onChange ({target}) { 
    setFormInput({
      ...formInput,
      [target.name]: target.value
    })

    if (inputError[target.name])
      setInputError({...inputError, [target.name]: ''})
  }

  React.useEffect(() => {
    setInputError(actionData?.error ?? {})
  }, [actionData])

  React.useEffect(() => {
    setCanSubmit(validateInput(formInput))
  }, [formInput])

  return (
  <>
  <header className="flex items-center py-6 px-4 justify-between">
    <a href="/">
      <img src={logo} alt="logo" width="100" />
    </a>
    <div>
      <a href="/signin"
        className="primary-btn-sm lg:text-black
        lg:bg-inherit lg:hover:bg-slate-50">
        Sign In
      </a>
    </div>
  </header>
  <hr className="max-lg:hidden" />
  <main className="max-w-xs mx-auto md:max-w-md relative
    lg:flex lg:max-w-4xl lg:gap-0 my-6 lg:my-12 lg:space-x-40">
    <section className="lg:w-1/2">
      <div><h1 className="text-4xl">Create an account</h1></div>
      <div className="my-4 flex flex-col gap-5 mt-40 lg:mt-4">
        <p>Be sure to enter your legal name as it 
          appears on your government-issued ID.</p>
        <p className="text-sm">Required fields have an asterisk: *</p>
        <Form method="post" replace>
          <div className="flex gap-3 flex-wrap">
            {signupForm.map(({name, width, ...props}) => 
              <div key={name} 
                className="grow max-lg:w-full"
                style={{width: width ?? ''}}>
                <Input
                  {...props}
                  name={name}
                  value={formInput[name]}
                  error={inputError[name]}
                  onChange={onChange}
                />
              </div>
            )}
            <div className="relative w-full">
              <div>
                <Input
                  caption="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formInput['password']}
                  error={inputError['password']}
                  onChange={onChange}
                  required
                />
              </div>
              <button className="absolute text-green-700 right-0
                px-3 h-6 top-10"
                type="button"
                onClick={() => {
                  setShowPassword((state) => !state)
                }}>
                <small>{showPassword ? 'hide' : 'show'}</small>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 mt-8">
            <input 
              type="checkbox" 
              name="policy" 
              id="policy" 
              className="col-span-1 cursor-pointer" 
              onChange={(e) => setFormInput(
                {...formInput, 
                  policy: e.target.checked}
              )}
            />
            <p className="col-span-11 text-xs">
              I certify that I am 18 years of age or older, 
              I agree to the <a className="link" href="#"> 
                User Agreement</a>,
              and I have read the <a className="link" href="#"> 
                Privacy Policy</a>.
            </p>
          </div>
          <div className="my-5">
            <Button 
              text="Create free account" 
              type="submit" 
              isLoading={isLoading}
              disabled={!canSubmit}
            />
          </div>
        </Form>
      </div>
    </section>
    <section className="flex lg:block absolute lg:w-1/3 
      lg:space-y-10 top-16 lg:relative lg:top-0 lg:items-center">
      <article>
        <h2 className="text-sm mb-4 font-medium 
          lg:font-normal lg:text-[2.5rem]/10 lg:text-center">
          Do more with crypto, only on Coinbase
        </h2>
        <p className="text-sm leading-5 lg:px-4">
          Set up your account and verify your 
          photo ID to get started on trading crypto.
        </p>
      </article>
      <div className="shrink-0">
        <img src={signupImg} 
          className="max-h-24 w-full lg:max-h-48"
        />
      </div>
    </section>
  </main>
  </>
  )
}


export default { 
  loader() {
    if (isLoggedIn())
      return redirect("/trade")

    return {ok: true}
  }, 
  action, 
  element: <Signup /> 
}