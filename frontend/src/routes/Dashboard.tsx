import toast from 'react-hot-toast'
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from 'react-router-dom'

import { 
  validateIdentity,
  fetchProfile,
  addPhone,
  signout,
  deletePhone,
  updatePassword,
  fetchPhoneNumbers,
  updatePrimaryPhone,
  updateDateOfBirth,
  updateUser,
  updateAddress,
  updateAvatar,
  PostBodyType,
} from '@/lib/server'
import Problem from '@/pages/dashboard/Problem'
import { placeOrder, updateOrder } from './order'
import { isFiat } from '@/lib/queries'
import { getUser, storeAuth, storeUser } from '@/lib/storage'


// BUG FOUND: 
// FIXED: password has been changed keep showing
// FIXED: crypto balance show loading when wallet exist but no balance
// FIXED: photo profile exist in database but not showing at first run app
// FIXED: profile edit address sometimes keep show save even when saved to server
// FIXED: after add phone number keep show input html


export const DashboardRoutes = {
  id: "dashboard",
  loader: dashboardLoader,
  async lazy() {
    const { DashboardLayout } = await import('../pages/dashboard/DashboardLayout')
    return { element: <DashboardLayout/> }
  },
  children: [
    { 
      path: "home", 
      async lazy() {
        const { Home } = await import('../pages/dashboard/Home')
        return { element: <Home/> }
      },
    },
    { 
      path: "earn", 
      async lazy() {
        const { Earn } = await import('../pages/dashboard/Earn')
        return { element: <Earn/> }
      },
    },
    { 
      path: "trade", 
      async lazy() {
        const { Trade } = await import('../pages/dashboard/Trade')
        return { element: <Trade/> }
      },
    },
    { 
      path: "assets", 
      async lazy() {
        const { MyAssets } = await import('../pages/dashboard/MyAssets')
        return { element: <MyAssets/> }
      },
    },
    { 
      path: "profile", 
      async lazy() {
        const { Profile } = await import('../pages/dashboard/Profile')
        return { element: <Profile/> }
      },
    },
    { 
      path: "rewards", 
      async lazy() {
        const { NotReady } = await import('../pages/dashboard/NotReady')
        return { element: <NotReady/> }
      },
    },
    {
      id: 'asset-view',
      async lazy() {
        const { AssetView } = await import('../pages/dashboard/AssetView')
        return { element: <AssetView/> }
      },
      errorElement: <Problem />,
      children: [
        { 
          path: "price/:name", 
          async loader({params}: LoaderFunctionArgs) {
            console.log('AssetDetail.loader', params.name)
            if (!await isFiat(params.name ?? ''))
              return {ok:true}

            return redirect(`/accounts/${params.name}`)
          },
          async lazy() {
            const { AssetDetail } = await import('../pages/dashboard/AssetView/AssetDetail')
            return { element: <AssetDetail/> }
          },
        },
        { 
          path: "accounts/:name", 
          async lazy() {
            const { AssetWallet } = await import('../pages/dashboard/AssetView/AssetWallet')
            return { element: <AssetWallet/> }
          },
        },
      ],
    },
    {
      async lazy() {
        const { Profile } = await import('../pages/dashboard/Profile')
        return { element: <Profile/> }
      },
      children: [
        { 
          index: true, 
          path: "profile", 
          action: actionProfileAccount,
          async lazy() {
            const { Account } = await import('../pages/dashboard/Profile/Account')
            return { element: <Account/> }
          },
        },
        { 
          path: "transactions", 
          async lazy() {
            const { Transactions } = await import('../pages/dashboard/Profile/Transactions')
            return { element: <Transactions/> }
          },
        },
      ],
    },
    {
      path: "settings", 
      async lazy() {
        const { Settings } = await import('../pages/dashboard/Settings')
        return { element: <Settings/> }
      },
      children: [
        {
          index: true,
          loader() {
            return redirect("/settings/security_settings")
          },
        },
        { 
          path: "security_settings", 
          action: actionSecurity,
          async lazy() {
            const { Security } = await import('../pages/dashboard/Settings/Security')
            return { element: <Security/> }
          },
        },
        { 
          path: "linked-accounts", 
          async lazy() {
            const { LinkedAccounts } = await import('../pages/dashboard/Settings/LinkedAccounts')
            return { element: <LinkedAccounts/> }
          },
        },
      ],
    },
    { path: 'preview', action: placeOrder, loader: () => redirect("/404") },
    { path: 'complete', action: updateOrder, loader: () => redirect("/404") },
    {
      path: 'signout', 
      action: async () => {
        await signout()
          .catch(err => {
            toast(err.message)
          })

        toast("Logged out")
        return redirect("/")
      },
      loader: () => redirect("/404")
    },
  ],
}


async function dashboardLoader({request}: LoaderFunctionArgs) {
  const id = 'loader'
  // console.log('important dashboardLoader executed')
  const response = await validateIdentity().catch(e => e)
  
  const redirectWithFrom = (to: string = '/') => {
    const params = new URLSearchParams()
    params.set("from", new URL(request.url).pathname)
    return redirect(`${to}?${params.toString()}`)
  }

  if (response.status >= 400) {
    toast(response.message, {id})

    if (401 == response.status || 422 == response.status) {
      storeAuth(null)
      return redirectWithFrom('/signin')
    }
    throw response
  }

  if (response.status == 202) 
    return redirect("/setup/phone")

  let userData = getUser()

  if (!userData?.user?.public_id) {
    userData = await fetchProfile()
    .then((resp) => resp.data)
    .catch((err) => {
      toast(err.message)
      return null
    })
  }

  if (!userData)
    throw new Error('Loader failed')

  const {
    preference: pref,
    phone_numbers: phones,
    ...rest
  } = userData

  return { pref, phones, ...rest }
}


async function actionSecurity({ request }: ActionFunctionArgs)
{
  const formData = Object.fromEntries(
    await request.formData()
  ) as PostBodyType
  const action = formData['action'] as string | null
  const id = 'action'
  

  const postForm = async (
    names: Array<string> = [], 
    apiFn: (body: PostBodyType) => Promise<unknown>) => 
  {
    let ok = false
    if (!names.length) return {ok};
    const body: PostBodyType = {}

    for (const name of names) {
      if (!formData[name]) {
        toast("Missing required field!", {id})
        return {ok}
      }

      body[name] = formData[name]
    }

    // console.log(id, body)
    ok = await apiFn(body)
    .then(() => fetchPhoneNumbers())
    .then(() => true)
    .catch((error) => {
      toast(error.message, {id})
      return false
    })

    return {ok}
  }

  switch (action) {
    case "UPDATE_PASSWORD":
      return postForm([
          'password',
          'new_password',
          'code_verification',
        ], updatePassword)
    case "UPDATE_PRIMARY_PHONE":
      return postForm(['number'], updatePrimaryPhone)
    case "DELETE_PHONE":
      return postForm(['number'], deletePhone)
    case "ADD_NEW_PHONE":
      return postForm(['number'], addPhone)
    default:
  }

  return { ok: true }
}


const KILO_BYTE = 1024

const createNestedObject = (
  dict: {[K in string]: unknown}, 
  names: Array<string>, 
  value: unknown
): typeof dict => 
{
    let temp: Partial<typeof dict> | null = dict

    for (let i=0; i < names.length; i++) {
        temp = 
          temp![names[i]] = 
          i < names.length-1 
            ? temp![names[i]] || {} 
            : value || null
    }
    return dict
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Tuple = [string, (...args: Array<any>) => any]

async function actionProfileAccount(
  { request }: ActionFunctionArgs
)
{
  const id = 'action'
  const returns = { ok: false }
  const formData = await request.formData()
  const formEncType = request.headers.get( 'content-type' )
  if (formEncType == null) {
    toast("Missing content-type", {id})
    return returns
  }
  const actionType = formData.get('actionType')

  // console.log({id, actionType, request, formEncType},
  //   Object.fromEntries(formData))

  const postForm = async (
    names: Array<string | Tuple> = [], 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiFn: (body: any) => Promise<unknown>
  ) => 
  {
    if (!names.length) return returns;
    const userData = getUser()
    if (userData == null) return returns; 
    const body: PostBodyType = {}

    for (let name of names) {
      let parseFunc

      if (Array.isArray(name)) {
        [name, parseFunc] = name
      }

      const pathList = name.split('/')
      const nestedLen = pathList.length
      const key = pathList[nestedLen-1]
      const value: FormDataEntryValue | null = parseFunc ? 
        parseFunc(formData.get(key)) :
        formData.get(key)

      if (!value) {
        toast("Missing required field!", {id})
        return returns
      }

      if (value instanceof File) {
        if (value.size >= (200 * KILO_BYTE)) {
          toast("Maximum file size is 200 KB", {id})
          return returns
        }
        const reader = new FileReader()
        reader.onload = () => {
          createNestedObject(userData, pathList, reader.result)
          // console.log({value, userData})
          if (returns.ok)
            storeUser(userData)
          // storeUser(userData)
        }
        reader.readAsDataURL(value)
      }

      else {
        body[key] = value
        createNestedObject(userData, pathList, value)
        // console.log({value, userData})
      }

    }

    returns.ok = await apiFn(
      formEncType.startsWith('multipart/form-data') 
      ? formData : body
    ).then(() => {
      storeUser(userData)
      return true
    }).catch((err) => {
      toast(err.message, {id})
      return false
    })

    return returns
  }

  switch (actionType) {
    case "UPDATE_DISPLAY_NAME":
      return postForm(['user/display_name'], 
        updateUser)
    case "UPDATE_EMAIL":
      return postForm(['user/email', 'user/new_email'], 
        updateUser)
    case "UPDATE_DOB":
      return postForm(['identity/date_of_birth'], 
        updateDateOfBirth)
    case "UPDATE_AVATAR":
      return postForm(['avatar', 'user/photo_url'], 
        updateAvatar)
    case "UPDATE_ADDRESS":
      return postForm([
        'address/street',
        'address/unit',
        'address/city',
        'address/country',
        ['address/postal_code', parseInt]
      ], updateAddress)
    default:
  }

  return returns
}
