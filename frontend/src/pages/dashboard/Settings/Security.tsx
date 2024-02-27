import React from 'react'
import { Form, useActionData, useNavigation, useOutletContext } from "react-router-dom"

import Modal from '@/components/Modal'
import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import { isValidPassword } from '@/lib/validation'
import { AngleRight, Close } from '@/components/Icons'
import { DashboardContextType } from '@/lib/context'
import { PhoneNumber } from '@/types'


export function Security() {
  const {phones} = useOutletContext<DashboardContextType>()
  const primaryNumber = React.useMemo(() => {
    if (!phones) return '~'
    const primary = phones.length === 1 
    ? phones[0] 
    : phones.find(({is_primary}) => is_primary)
    return primary?.number
    ? `+xx xxx xxxx xx${primary.number.slice(-2)}`
    : '~'
  }, [phones])

  // console.log('Security.render', primaryNumber)

  return (
    <div className="sm:px-5 py-12 space-y-6 sm:mx-auto max-w-screen-md">
      <section className="sm:container-section max-sm:border-y 
        space-y-2 px-8 py-8">
        <h4 className="text-blue-600 font-bold">
          Security Recommendations
        </h4>
        <h2 className="text-3xl">
          Upgrade 2FA
        </h2>
        <p className="py-5">
          Text based-2-step verification is better than no 2FA,
          but still vulnerable to <a href="https://google.com" 
          target="_blank" className="link underline">account takeover (ATO)
          </a>. If you have Security Prompt enabled ensure that 
          your account remains logged in for added security. 
          Otherwise, upgrade to and authenticator app. Click learn
          more to find out why 95% of ATOs occur with accounts
          on text 2FA.
        </p>
        <div className="flex gap-5 w-fit">
          <button
            disabled
            className="primary-btn">
            Upgrade 2FA
          </button>
          <button
            disabled
            className="secondary-btn">
            Learn more
          </button>
        </div>
      </section>
      <section className="sm:container-section max-sm:border-y 
        flex gap-3 items-center py-5 px-8">
        <span className="grow">
          <h3 className="font-medium">
            Learn how to protect yourself
          </h3>
          <p className="text-gray-600">
            Review a few tips to keep your account safe
          </p>
        </span>
        <small className="text-blue-600 font-bold">
          RECOMMENDED
        </small>
        <a href="https://google.com" target="_blank"
          className="p-2 text-gray-500 hover:text-blue-600">
          <AngleRight className="w-2"/>
        </a>
      </section>
      <section className="sm:container-section max-sm:border-y 
        px-8 pt-2 pb-8">
        <h2 className="text-3xl font-medium mt-6 mb-2">
          Password
        </h2>
        <div className="p-5 flex sm:gap-8 gap-5 sm:items-center flex-col
          sm:flex-row justify-between border rounded-sm">
          <p className="leading-5">
            Remember not to store your password in your email
            or cloud and don't share it with anyone
          </p>
          <Modal isCenterScreen hideClose
            trigger={
              <button className="secondary-btn-sm w-full">
                Change password
              </button>
            }>
            {({setOpen}) => (
              <ChangePasswordModal 
                onExit={() => setOpen(false)} 
              />
            )}
          </Modal>
        </div>
        <h2 className="text-3xl font-medium mt-6 mb-2">
          Phone numbers
        </h2>
        <div className="p-5 flex gap-8 items-center 
          justify-between border rounded-sm">
          <div className="">
            <span className="">
              <img src="" alt="" className="" />  
            </span>
            <span className="">
              <h5 className="font-medium">
                {primaryNumber}
              </h5>
              <p className="text-gray-600 text-sm">
                Keep your primary phone number up-to-date
              </p>
              <small className="text-green-600 font-bold">
                Required
              </small>
            </span>
          </div>
          <Modal isCenterScreen hideClose
            trigger={
              <button className="secondary-btn-sm">
                Manage
              </button>
            }>
            {({setOpen}) => (
              <ManagePhoneNumbersModal 
                phones={phones}
                onExit={() => setOpen(false)} 
              />
            )}
          </Modal>
        </div>
        <h2 className="text-3xl font-medium mt-6 mb-2">
          2-step verification
        </h2>
        <p className="font-medium">
          Select your 2-step verification method
        </p>
        <p className="text-gray-600">
          Your 2-step verification method is valid across all
          your Coinbase accounts
        </p>
        <h5 className="text-gray-500 font-bold mt-6 mb-2">
          CURRENT
        </h5>
        <div className="flex flex-col md:flex-row">
          <div className="p-5 flex gap-8 items-center 
            border rounded-sm border-l-4
            border-l-blue-600">
            <div className="grow">
              <span className="">
                <img src="" alt="" className="" />  
              </span>
              <span className="">
                <h5 className="font-medium text-lg">
                  Text message
                </h5>
                <p className="text-gray-600 text-sm">
                  Phone number {primaryNumber}
                </p>
              </span>
            </div>
            <span className="w-fit">
              <button disabled
                className="secondary-btn-sm">
                Remove
              </button>
            </span>
          </div>
          <div className="w-[200px]"></div>
        </div>
      </section>
    </div>
  )
}


const ChangePasswordModal = ({onExit}: {
  onExit: () => void
}) => 
{
  const actionData = useActionData() as {ok:boolean}
  const {ok} = actionData ?? {ok:false} 
  const [saved, setSaved] = React.useState(false)
  const [state, setState] = React.useState({
    password: '',
    new_password: '',
    confirm_new_password: '',
    code_verification: '3 1 0 8 6 2 8'
  })
  const navigation = useNavigation()
  const isSubmiting = navigation.formData != null

  // console.log('ChangePasswordModal.render', navigation)

  const isSubmitReady = isValidPassword(
    state.new_password) && 
    state.new_password === state.confirm_new_password

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => 
  {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  React.useEffect(() => {
    if(navigation.state === "loading"
        && ok) setSaved(true)
  }, [navigation.state, ok])


  if (saved)
    return (
      <div
        className="sm:container-section sm:w-fit sm:max-w-[450px] 
        mx-auto divide-y w-full bg-white h-full max-h-screen">
        <div className="flex justify-end px-5 py-5 sm:py-3">
          <button type="button" 
            onClick={() => {
              setSaved(false)
              onExit()
            }}
            className="text-gray-500 hover:text-red-600 p-1">
            <Close className="w-3 " />
          </button>
        </div>
        <p className="text-green-600 text-center 
          font-medium p-6">
          Your password has been changed!
        </p>
      </div>
    )


  return (
    <Form method="post"
      className="sm:container-section sm:w-fit w-full mx-auto 
      px-5 h-full max-h-screen sm:w-fit bg-white pt-4 pb-1">
      <h1 className="font-medium text-2xl sm:hidden mb-5">
        Change Password
      </h1>
      <p className="text-sm mb-1">
        Old Password
      </p>
      <input type="hidden" name="action"
        value="UPDATE_PASSWORD" />
      <input type="password" 
        className="border border-gray-400 rounded-[4px]
        focused-ring bg-transparent px-5 h-12 w-full"
        name="password"
        required
        onChange={handleChange}
        value={state['password']}
        placeholder="Old Password" 
      />
      <p className="mt-4 mb-1 text-sm">
        New Password
      </p>
      <FormInput type="password" 
        className="border border-gray-400 rounded-[4px]
        focused-ring bg-transparent px-5 h-12 w-full"
        name="new_password"
        required
        onChange={handleChange}
        value={state['new_password']}
        placeholder="New Password" 
      />
      <p className="mt-4 mb-1 text-sm">
        Confirm new password
      </p>
      <input type="password" 
        className="border border-gray-400 rounded-[4px]
        focused-ring bg-transparent px-5 h-12 w-full peer"
        name="confirm_new_password"
        onChange={handleChange}
        pattern={state.new_password}
        value={state['confirm_new_password']}
        placeholder="Confirm new password" 
      />
      <p className="text-sm font-medium text-red-600
        peer-invalid:block hidden">
        Password did't match
      </p>
      <p className="mt-6 mb-1 text-xs text-center 
        font-medium px-3 w-[300px] mx-auto">
        Enter the 2-step verification code 
        we texted to your phone
      </p>
      <div className="w-fit mx-auto mb-3 space-y-3 py-3">
        <input type="text" 
          className="text-center w-[7rem] mx-auto rounded-sm
          block"
          readOnly={true}
          name="code_verification"
          onChange={handleChange}
          value={state['code_verification']}
        />
        <p className="text-sm mx-auto w-fit">
          Didn't receive the SMS? <a href="#" target="_blank"
          className="link">Re-send SMS</a>
        </p>
        <div className="flex gap-2 w-fit h-fit mx-auto">
          <button type="button"
            onClick={onExit}
            className="secondary-btn">
            Cancel
          </button>
          <Button  
            type="submit" 
            isLoading={isSubmiting}
            disabled={!isSubmitReady}
            width="150px"
          >Confirm</Button>
        </div>
      </div>
    </Form>
  )
}


const ManagePhoneNumbersModal = ({onExit, phones}: {
  onExit: () => void
  phones: Array<PhoneNumber>
}) => {
  const actionData = useActionData() as {ok:boolean}
  const {ok} = actionData ?? {ok:false} 
  const [toggleNew, setToggleNew] = React.useState(false)

  const navigation = useNavigation()
  const isSubmiting = navigation.formData != null

  React.useEffect(() => {
    if(navigation.state === "loading"
        && ok) setToggleNew(false)
  }, [navigation.state, ok])


  return (
    <div className="sm:container-section sm:w-fit w-full mx-auto 
      h-full max-h-screen sm:w-fit bg-white">
      <div className="flex justify-between px-5 py-5 sm:py-3
        border-b">
        <h3 className="font-medium text-xl">
          Manage phone numbers
        </h3>
        <button type="button" 
          onClick={onExit}
          className="text-gray-500 hover:text-red-600 p-1">
          <Close className="w-3 " />
        </button>
      </div>
      <div className="w-full">
        {phones?.map(({number, is_primary, created_at}) => (
          <div key={number}
            className="px-5 py-3 flex sm:items-center justify-between
              border-b flex-col sm:flex-row gap-3">
            <div className="w-fit max-w-[10rem] mr-6">
              <p className="font-medium">
                {`+xx xxx xxxx xx${number.slice(-2)}`}
              </p>
              <p className="text-gray-600 text-sm">
                Added at {created_at.slice(0,11)}
              </p>
              {is_primary ? (
                <p className="text-green-600 font-bold text-sm">
                  Primary
                </p>
              ) : ''}
            </div>
            <div className="flex gap-2">
              <Form method="post" className="w-full">
                <input type="hidden" name="action"
                  value="UPDATE_PRIMARY_PHONE" />
                <input type="hidden" name="number" 
                  value={number} />
                <button type="submit" 
                  disabled={is_primary || isSubmiting}
                  className="secondary-btn w-full">
                  Primary
                </button>
              </Form>
              <Form method="post" className="w-full">
                <input type="hidden" name="action"
                  value="DELETE_PHONE" />
                <input type="hidden" name="number" 
                  value={number} />
                <button type="submit" 
                  disabled={is_primary || isSubmiting}
                  className="secondary-btn w-full">
                  Remove
                </button>
              </Form>
            </div>
          </div>
        ))}
        {toggleNew ? (
          <Form method="post"
            className="px-5 py-3 flex gap-2 items-center justify-center">
            <input type="hidden" name="action" 
              value="ADD_NEW_PHONE" />
            <div className="w-fit max-w-[12rem]">
              <input type="text" 
                className="input-simple h-12" 
                name="number"
              />
            </div>
            <span className="flex gap-2">
              <button type="submit" 
                disabled={isSubmiting}
                className="primary-btn">
                Save
              </button>
              <button type="button" 
                onClick={() => setToggleNew(false)}
                disabled={isSubmiting}
                className="secondary-btn">
                Cancel
              </button>
            </span>
          </Form>
        ) : ''}
        <div className="py-6 w-fit mx-auto">
          <button type="button"
            onClick={() => setToggleNew(true)}
            className="primary-btn ">
            Add another phone number
          </button>
        </div>
      </div>
    </div>
  )
}
