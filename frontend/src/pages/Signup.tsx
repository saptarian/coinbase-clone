import React from 'react'
import { Link, Form, useNavigation } from 'react-router-dom'
import { isValidEmail, isValidPassword, isEveryInputOK } from '@/lib/validation'

import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import { signupFormWithPattern } from '@/constants'
import signupImg from '@/assets/bitcoinAndOtherCrypto-0.svg'
import logo from '@/assets/logo-coinbase.svg'


const initial = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  policy: false,
}

type FormValues = typeof initial


export function Signup() {
  const [formInput, setFormInput] = React.useState(initial)
  const navigation = useNavigation()
  const isSubmiting = navigation.formData != null
  const isSubmitReady = isEveryInputOK<FormValues>(formInput, {
    first_name: (val) => /^[A-Za-z0-9]{3,16}$/.test(val),
    last_name: (val) => /^[A-Za-z0-9]{1,16}$/.test(val),
    email: isValidEmail,
    password: isValidPassword,
  })


  return (
    <>
      <header className="flex items-center py-6 px-4 justify-between">
        <Link to="/">
          <img src={logo} alt="logo" width="100" />
        </Link>
        <div>
          <Link to="/signin"
            className="primary-btn-sm lg:text-black
            lg:bg-inherit lg:hover:bg-slate-50">
            Sign In
          </Link>
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
                {signupFormWithPattern.map(
                  ({width, ...item}, idx) => (
                  <div key={idx} 
                    className="grow w-full lg:w-fit"
                    style={{width: width ?? ''}}>
                    <FormInput {...item} 
                      onChange={(e) => {
                        setFormInput({
                          ...formInput,
                          [e.target.name]: e.target.value
                        })
                      }}
                      value={
                        formInput[item.name]
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-8 items-center">
                <input 
                  type="checkbox" 
                  name="policy" 
                  id="policy" 
                  className="col-span-1 cursor-pointer rounded-sm w-5 h-5" 
                  onChange={(e) => setFormInput(
                    {...formInput, 
                      policy: e.target.checked}
                  )}
                />
                <p className="col-span-9 text-xs">
                  I certify that I am 18 years of age or older, 
                  I agree to the <a className="link" href="#"> 
                    User Agreement</a>,
                  and I have read the <a className="link" href="#"> 
                    Privacy Policy</a>.
                </p>
              </div>
              <div className="my-5">
                <Button  
                  type="submit" 
                  isLoading={isSubmiting}
                  disabled={!isSubmitReady}
                >Create free account</Button>
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
