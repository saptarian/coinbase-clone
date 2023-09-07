import React from 'react'
import { Navigate } from 'react-router'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { loginSchema } from 'root/lib/validation';
import { useLoginQuery } from 'root/services/queries/auth.query'
import useAuthStore from 'root/store/useAuthStore'
import { type LoginBody } from 'root/types/auth'
import { setItem } from 'root/lib/localStorage'

import styled from 'styled-components/macro'
import tw from 'twin.macro'

import coinbaseLogo from 'app/assets/logo-coinbase.svg'

export default function Signin() {

  const { setIsAuthenticated } = useAuthStore((state) => state)
  const { isLoading, mutateAsync: login, isError, error, data } = useLoginQuery()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginBody>({ resolver: yupResolver(loginSchema) })

  const onSubmit = async (event) => {
    event.preventDefault()
    const { email, password } = event.target
    const formData = {
      email: email.value,
      password: password.value
    }
    await login(formData)
    setIsAuthenticated(true)

    if (!isError && data) {
      setItem('token', data.access_token)
      return <Navigate to="/explore" />
    }
  }

  console.log("data", data)
  // console.log("isLoading", data)
  // console.log("isError", isError)
  // console.log("mutateAsync", login)

	return (
		<>
      {}
      <SigninForm 
        >
        <img src={coinbaseLogo} alt="coinbase logo" width="120"
          className="sm:mb-8 mb-3" 
        />
        <h1 className="text-2xl
          "><strong>Sign in to Coinbase</strong>
        </h1>
        <p className="text-sm/4 text-slate-500
          ">
          Not your device? Use a private or incognito window to sign in</p>
        <form onSubmit={onSubmit}
        >
          <p className="text-sm
            "><strong>Email</strong>
          </p>
          <input type="email" name="email" className="ring-1 ring-gray-500 
            rounded-lg h-12 px-4 hover:bg-slate-100" 
            placeholder="Your email address" 
          />
          <p className="text-sm
            "><strong>Password</strong>
          </p>
          <input type="password" name="password" className="ring-1 ring-gray-500 
            rounded-lg h-12 px-4 hover:bg-slate-100" 
            placeholder="" 
          />
          <input type="submit" value="Continue" />
          <label className="text-center
            ">
            <a href="#" className="text-sm  
              text-sky-500 hover:text-sky-600">
              Privacy policy
            </a>
          </label>
        </form>
      </SigninForm>
		</>
	)
}

const SigninForm = styled.main`
  ${tw`flex flex-col max-w-sm sm:ring-1
  sm:ring-gray-900/10 sm:rounded-2xl gap-4
  mx-auto sm:p-10 sm:mt-8 p-6`}

  & {
    form {
      ${tw`mt-4 flex flex-col gap-4`}
    }
    input[type="submit"] {
      ${tw`bg-blue-600
        rounded-full text-white py-3
        cursor-pointer font-medium`}
      &:hover { ${tw`bg-blue-700`} }
    }
  }
`