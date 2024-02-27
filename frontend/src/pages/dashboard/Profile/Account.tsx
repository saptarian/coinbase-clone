import React from 'react'
import { 
  Form, 
  useActionData,
  useNavigation,
  useOutletContext, 
} from "react-router-dom"
import { YEAR_MIN, YEAR_MAX, postalCodePattern, } from '@/constants'
import type { Address, Identity, Preference, User } from '@/types'
import Modal from '@/components/Modal'
import { Close } from '@/components/Icons'

import { isValidEmail, isEveryInputOK } from '@/lib/validation'
import { profileReducer, PROFILE_ACTION_TYPE } from '@/lib/reducer'
import { DashboardContextType } from '@/lib/context'


type UserState = User & Preference & Address & Identity

const isAddressReady = (formAddress: Address) => {
  return isEveryInputOK<Address>(formAddress, {
    postal_code: (val) => 
      new RegExp(postalCodePattern).test(val.toString())
  })
}


export function Account() {
  const {
    user, address, pref, identity, avatar
  } = useOutletContext<DashboardContextType>()
  const [state, dispatch] = 
  React.useReducer(profileReducer<UserState>, {
    ...user, 
    ...pref, 
    ...address, 
    ...identity,
  })
  const [newEmail,] = React.useState('')

  const navigation = useNavigation()
  const isSubmiting = navigation.formData != null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: PROFILE_ACTION_TYPE.updateProfile,
      payload: {
        name: e.target.name, 
        value: e.target.value,
      },
    })
  }

  const isAddressSaved = Boolean(
    state.country === address.country &&
    state.city === address.city &&
    state.unit === address.unit &&
    state.street === address.street &&
    state.postal_code == address.postal_code
  )

  const formAddress = {
    country: state.country,
    postal_code: state.postal_code,
    city: state.city,
    unit: state.unit,
    street: state.street,
  }

  // console.log('Account.render', 
  //   {state, user, address, pref, 
  //   identity, isAddressSaved}, isAddressReady(formAddress) )

  let dob: string | Array<string> = state.date_of_birth

  if (dob)
    dob = new Date(dob).toISOString().split("T")

  return (
    <div className="px-5 pt-1 pb-12 space-y-6 mx-auto
     max-w-screen-sm">
      <section className="flex flex-col py-5">
        <div className="mx-auto flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-400 
            rounded-full overflow-hidden">
            {avatar ? (
              <img src={avatar} 
                className="w-full"
              />
            ) : (
              <p className="text-white text-[80px] font-bold 
                text-center w-full">
                {user.display_name.slice(0,1).toUpperCase()}
              </p>
            )}
          </div>
          <img src="" alt="" />
          <h2 className="mt-6 text-3xl">
            {user.display_name}
          </h2>
          <p className="font-medium text-gray-500 text-lg">
            {user.email}
          </p>
        </div>
        <div className="mx-auto mt-4">
          <Modal isCenterScreen hideClose
            trigger={
              <button type="button" 
                className="secondary-btn-sm">
                Edit profile photo
              </button>
            }>
            {({setOpen}) => (
              <FormPhotoModal 
                onExit={() => setOpen(false)} 
                avatar={avatar}
              />
            )}
          </Modal>
        </div>
      </section>

      <section className="ring-1 ring-gray-300 
        mx-auto rounded-lg max-w-3xl">
        <h2 className="border-b p-5 text-xl">
          Contact info
        </h2>
        <div className="divide-y">
          <Form method="post"
            className="p-5 flex flex-col gap-6">
            <input type="hidden" name="actionType" 
              value="UPDATE_DISPLAY_NAME" 
            />
            <div className="space-y-3">
              <h3>Display name</h3>
              <input type="text" name="display_name"
                className="input-simple"
                onChange={handleChange}
                value={state.display_name}
              />
            </div>
            <SaveButton 
              disabled={isSubmiting || 
              state.display_name === user.display_name || 
              !state.display_name}
            />
          </Form>
          <Form method="post" 
            className="p-5 flex flex-col gap-6">
            <input type="hidden" name="actionType" 
              value="UPDATE_EMAIL" 
            />
            <div className="space-y-3">
              <h3>Email address</h3>
              <input type="text" readOnly 
                className="input-simple bg-gray-100"
                name="email"
                onChange={handleChange}
                value={state.email}
              />
              {/*<input type="text" name="new_email" 
                className="input-simple"
                placeholder="Email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />*/}
            </div>
            <SaveButton 
              disabled={isSubmiting ||
              !isValidEmail(newEmail)}
            />
          </Form>
        </div>
      </section>

      <section className="ring-1 ring-gray-300 
        mx-auto rounded-lg max-w-3xl">
        <h2 className="border-b p-5 text-xl">
          Personal info
        </h2>
        <div className="divide-y">
          <Form method="post" 
            className="p-5 flex flex-col gap-6">
            <h3>Legal name</h3>
            <p>
              Changing your legal name 
              requires updating your ID document.
              <a href="#" className="link"> Change!</a>
            </p>
            <input type="text" disabled
              className="input-simple"
              name="full_name"
              onChange={handleChange}
              value={
                `${state.first_name} ${state.last_name}`
              }
            />
          </Form>
          <Form method="post" 
            className="p-5 flex flex-col gap-6">
            <input type="hidden" name="actionType" 
              value="UPDATE_DOB" 
            />
            <div className="space-y-3">
              <h3>Date of birth</h3>
              <input type="date" 
                className="input-simple"
                name="date_of_birth"
                min={`${YEAR_MIN}-01-01`}
                max={`${YEAR_MAX}-12-31`}
                onChange={handleChange}
                value={dob ? dob[0] : ""}
              />
            </div>
            <SaveButton 
              disabled={isSubmiting || 
              state.date_of_birth === identity.date_of_birth}
            />
          </Form>
          <Form method="post"
            className="p-5 flex flex-col gap-6">
            <input type="hidden" name="actionType" 
              value="UPDATE_ADDRESS" 
            />
            <div className="space-y-3">
              <h3>Address</h3>
              <input type="text" 
                className="input-simple"
                name="street"
                onChange={handleChange}
                placeholder="Street address"
                value={state.street}
              />
            </div>
            <div className="flex gap-4">
              <input type="text" 
                className="input-simple"
                name="unit"
                onChange={handleChange}
                placeholder="Unit# "
                value={state.unit}
              />
              <input type="text" 
                className="input-simple"
                name="city"
                onChange={handleChange}
                placeholder="City "
                value={state.city}
              />
            </div>
            <div className="flex gap-4">
              <input type="text" 
                className="input-simple"
                name="postal_code"
                onChange={handleChange}
                placeholder="Postal code"
                pattern={postalCodePattern}
                value={state.postal_code}
              />
              <input type="text" 
                className="input-simple"
                name="country"
                onChange={handleChange}
                placeholder="Country"
                value={state.country}
              />
            </div>
            <SaveButton 
              disabled={
                isSubmiting || 
                !isAddressReady(formAddress) || 
                isAddressSaved
              }
            />
          </Form>
        </div>
      </section>

      <PreferencesSection />

      <CloseAccountSection />

      {/*<DiscardChangesModal />*/}
    </div>
  )
}


const SaveButton = ({disabled=false, className, width}: {
  disabled?: boolean
  className?: string
  width?: string
}) => (
  <div className="ml-auto"
    style={{width: width ?? '200px'}}>
    <button type="submit" 
      className={`transition-color duration-150 ease-in-out ${
        disabled ? "" : ""
      } ${className ?? "primary-btn"} w-full`}
      disabled={disabled} 
    >Save</button>
  </div>
)


const FormPhotoModal = ({onExit, avatar}: {
  onExit: () => void
  avatar?: string
}) => {
  const actionData = useActionData() as {ok:boolean}
  const {ok} = actionData ?? {ok:false} 
  const [avatarURL, setAvatarURL] = 
    React.useState(avatar)

  const navigation = useNavigation()
  const isSubmiting = navigation.formData != null

  // console.log('FormPhotoModal.render', {
  //   ok, avatarURL, navigation
  // })

  React.useEffect(() => {
    if(navigation.state === "loading" && ok)
      onExit()
  }, [navigation.state, ok])


  return (
    <div className="sm:container-section sm:w-fit w-full mx-auto 
      h-full max-h-screen sm:w-fit bg-white pb-1">
      <div className="flex justify-between px-5 py-5 sm:py-3
        border-b">
        <h3 className="font-medium text-xl">
          Choose an image
        </h3>
        <button type="button" 
          onClick={onExit}
          className="text-gray-500 hover:text-red-600 p-1">
          <Close className="w-3 " />
        </button>
      </div>
      <Form method="post" encType="multipart/form-data"
        className="p-5 flex items-center gap-5 flex-col
          sm:flex-row">
        <div className="w-32 h-32 flex-none bg-slate-200
          rounded-full overflow-hidden">
          {avatarURL ? (
            <img src={avatarURL} />
          ) : ''}
        </div>
        <div className="flex flex-col w-[250px]">
          <input type="hidden" 
            value="UPDATE_AVATAR" name="actionType"/>
          <p className="font-bold text-gray-500 text-xs mb-1">
            *Maximum file size: 200 KB
          </p>
          <input type="hidden" name="photo_url"
            value="/user/avatar" />
          <input type="file" 
            accept="image/*"
            name="avatar"
            onChange={({target}) => {
              if (target.files?.length) {
                const reader = new FileReader
                reader.onload = () => {
                  setAvatarURL(reader.result as string)
                }
                reader.readAsDataURL(target.files[0])
              }
            }}
            className="bg-slate-200 rounded-sm mb-2" 
          />
          <SaveButton 
            className="primary-btn-sm h-10"
            width="120px"
            disabled={isSubmiting || 
            avatarURL === avatar} 
          />
        </div>
      </Form>
    </div>
  )
}


const PreferencesSection = () => {
  return (
    <section className="ring-1 ring-gray-300 
      mx-auto rounded-lg max-w-3xl">
      <h2 className="border-b  p-5 
        text-xl">Preferences</h2>
      <div className="divide-y">
        <Form method="post" 
          className="p-5 flex flex-col gap-6">
          <div className="space-y-3">
            <h3>Timezone</h3>
            <select name="timezone" 
              className="input-simple">
              <option value="GMT+0">
                (GMT+00:00) UTC
              </option>
            </select>
          </div>
          <SaveButton disabled />
        </Form>
        <Form method="post" 
          className="p-5 flex flex-col gap-6">
          <div className="space-y-3">
            <h3>Currency</h3>
            <select name="currency" 
              className="input-simple">
              <option value="USD">
                US Dollar (USD)
              </option>
            </select>
          </div>
          <SaveButton disabled />
        </Form>
      </div>
    </section>
  )
}


const CloseAccountSection = () => {
  return (
    <section className="ring-1 ring-gray-300 
      mx-auto rounded-lg max-w-3xl">
      <h2 className="border-b p-5 text-xl">
        Close account
      </h2>
      <div className="divide-y">
        <Form method="post"
          className="p-5 flex flex-col gap-6">
          <p>
            Closing your account can’t be undone. 
            Please make sure your account balance 
            is $0.00 before you begin.
          </p>
          <button type="submit" disabled 
            className="danger-btn">
            Close account
          </button>
        </Form>
      </div>
    </section>
  )
}


// const DiscardChangesModal = () => {
//   return (
//     <div className="rounded-md max-w-3xl mx-auto
//       ring-4 ring-gray-200">
//       <div className="relative p-5">
//         <h2 className="text-center">
//           Discard changes
//         </h2>
//         <div className="absolute right-5
//           text-gray-600 top-5 font-medium">
//           X
//         </div>
//       </div>
//       <hr />
//       <div className="p-5">
//         <p>You have unsaved changes that
//           will be lost by editing this information. 
//           Are you sure you want to continue without saving?
//         </p>
//         <div className="flex gap-4 w-full py-5 flex-wrap">
//           <div className="md:w-[220px] w-full">
//             <button className="secondary-btn">
//               Cancel
//             </button>
//           </div>
//           <div className="grow">
//             <button className="primary-btn w-full">
//               Continue without saving
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
