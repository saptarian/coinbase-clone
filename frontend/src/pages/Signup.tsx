import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import styled from 'styled-components/macro'
import tw from 'twin.macro'

import coinbaseLogo from 'app/assets/logo-coinbase.svg'
import signupImg from 'app/pages/Signup/assets/bitcoinAndOtherCrypto-0.svg'

export default function Signup() {

  const onSubmitForm = (event?: React.FormEvent) => {
    event.preventDefault()
    const { firstName, lastName, email, password } = event.target
    
  }

  return (
    <>
      <SignupHeader>
        <a href="/">
          <img src={coinbaseLogo} alt="coinbase logo" width="100" />
        </a>
        <button><a href="#">Sign In</a></button>
      </SignupHeader>
      <hr className="hidden lg:block" />
      <SignupMain>
        <SignupContainer>
          <div><h1 className="text-4xl">Create an account</h1></div>
          <SignupForm>
            <p>Be sure to enter your legal name as it 
              appears on your government-issued ID.</p>
            <p className="text-sm">Required fields have an asterisk: *</p>
            <form onSubmit={onSubmitForm}>
              <div className="lg:flex lg:gap-4">
                <div>
                  <Caption>Legal first name*</Caption>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName"  
                    placeholder="Legal first name"
                  />
                </div>
                <div>
                  <Caption>Legal last name*</Caption>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Legal last name"
                  />
                </div>
              </div>
              <Caption> Email* </Caption>
              <input 
                type="email"
                id="email" 
                name="email" 
                placeholder="Email"
              />
              <Caption> Password* </Caption>
              <input 
                type="password"
                id="password"
                name="password" 
                placeholder="Minimum 8 characters"
              />
              <div className="grid grid-cols-12 gap-2 my-4">
                <input type="checkbox" name="policy" 
                  id="policy" className="col-span-1
                    cursor-pointer" />
                <p className="col-span-11 text-xs">
                  I certify that I am 18 years of age or older, 
                  I agree to the
                  <Link href="#"> User Agreement</Link>,
                  and I have read the
                  <Link href="#"> Privacy Policy</Link>.
                </p>
              </div>
              <input type="submit" value="Create free account" />
            </form>
          </SignupForm>
        </SignupContainer>
        <SignupArticle>
          <article>
            <h2>Do more with crypto, only on Coinbase</h2>
            <p>Set up your account and verify your 
              photo ID to get started on trading crypto.</p>
          </article>
          <div className="shrink-0">
            <img src={signupImg} alt="" />
          </div>
        </SignupArticle>
      </SignupMain>
    </>
  )
}

const SignupMain = styled.main`
  ${tw`max-w-xs mx-auto md:max-w-md relative
    lg:flex lg:max-w-4xl lg:gap-0 my-6 lg:my-12
    lg:space-x-40`}
`;

const SignupContainer = styled.section`
  ${tw`lg:w-1/2`}
`;

const SignupForm = styled.div`
  ${tw`my-4 flex flex-col gap-5 mt-40 lg:mt-4`}

  & {
    input[type="text"], [type="password"], [type="email"] {
      ${tw`ring-1 ring-gray-500 rounded-lg
        w-full h-12 my-2 px-4`}

      &:hover { ${tw`bg-slate-100`} }
    }
    input[type="submit"] {
      ${tw`bg-blue-600 rounded-full w-full
        text-white justify-center cursor-pointer mb-4
        font-medium px-8 py-4`}

      &:hover { ${tw`bg-blue-700`} }
    }
  }
`;

const SignupArticle = styled.section`
  ${tw`flex lg:block absolute lg:w-1/3 
    lg:space-y-10 top-16 lg:relative lg:top-0 
    lg:items-center`}

  & {
    h2 {
      ${tw`text-sm mb-4 font-medium lg:font-normal
      lg:text-[2.5rem]/10 lg:text-center`}
    }
    p {
      ${tw`text-sm leading-5 lg:px-4`}
    }
    img {
      ${tw`max-h-24 w-full lg:max-h-48`}
    }
  }
`;

const Link = styled.a`
  ${tw`text-sky-500`}

  &:hover { ${tw`text-sky-600`} }
`;

const Caption = styled.p`
  ${tw`font-medium text-sm`}
`;

const SignupHeader = styled.header`
  ${tw`flex items-center py-6 px-4 relative`}

  & {
    button {
      ${tw`bg-blue-600 rounded-full text-white 
        font-medium px-8 py-2 
        text-sm absolute right-4 lg:bg-inherit
        lg:text-black`}

      &:hover { ${tw`max-md:bg-blue-700`} }
    }
  }
`;

