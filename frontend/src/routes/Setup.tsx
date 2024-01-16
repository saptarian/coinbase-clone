import toast from 'react-hot-toast'
import type { LoaderFunctionArgs } from "react-router-dom"
import { redirect } from "react-router-dom"
import { 
  createPhone,
  validatePhone,
  isLoggedIn,
  fetchUser,
  fetchProfile,
  createIdentity, 
  validateIdentity, 
} from '@/lib/server'
import { queryClient } from '@/lib/queries'
import { BodySetupIdentity } from '@/types'


export const SetupRoutes = {
  path: "setup", 
  loader: loaderSetupLayout,
  async lazy() {
    const { SetupLayout } = await import('../pages/setup/SetupLayout')
    return { element: <SetupLayout/> }
  },
  children: [
    { 
      path: "phone", 
      loader: loaderSetupPhone,
      action: actionSetupPhone,
      async lazy() {
        const { SetupPhone } = await import('../pages/setup/SetupPhone')
        return { element: <SetupPhone/> }
      },
    },
    { 
      path: "identity", 
      loader: loaderSetupIdentity,
      action: actionSetupIdentity,
      async lazy() {
        const { SetupIdentity } = await import('../pages/setup/SetupIdentity')
        return { element: <SetupIdentity/> }
      },
    },
  ],
}


async function loaderSetupPhone() {
  const ok = await validatePhone()
  .then((resp) => {
    if (resp.status == 202) 
      return true
  })
  .catch((err) => {
    toast(err.message)
    return false
  })

  return ok ? {ok} : 
    redirect("/setup/identity")
}


async function actionSetupPhone({ request }: LoaderFunctionArgs) {
  const formData = await request.formData()
  const prefix = formData.get("prefix") as string | null
  const number = formData.get("number") as string | null
  const id = 'action'

  if (!prefix || !number) {
    toast("Phone number is required", {id})
    return { ok: false }
  }

  const phone_number = `${prefix}${number}`
  const ok = await createPhone({phone_number})
  .then(() => true)
  .catch((err) => {
    toast(err.message, {id})
    return false
  })

  return ok ? 
    redirect("/setup/identity") : {ok}
}


function loaderSetupLayout() {
  if (!isLoggedIn())
    return redirect("/signin")

  return {ok: true}
}


async function loaderSetupIdentity() {
  const returns = 
  await validateIdentity()
  .then((resp) => {
    if (resp.status == 202) return fetchUser()
    return null
  })
  .then((resp) => resp != null ? 
    ({ok:true, user:resp.data}) : 
    ({ok:false})
  )
  .catch((err) => {
    toast(err.message)
    return {ok:false}
  })

  return returns.ok ? returns : 
    redirect("/home")
}


async function actionSetupIdentity({ request }: LoaderFunctionArgs) {
  const formData = Object.fromEntries(
    await request.formData()
  ) as {[K in string]: string}
  const id = 'action'

  // TODO: Doing some validation check before hit the server

  const month = formData["month"]
  const day = formData["day"]
  const year = formData["year"]
  const date_of_birth = `${year}-${month}-${day}`

  const body: BodySetupIdentity = {
    identity: {
      date_of_birth,
    },
    address: {
      street: formData["street"],
      city: formData["city"],
      postal_code: formData["postal_code"],
      country: formData["country"],
    },
    analytic: {
      use_app_for: formData["use_app_for"],
      source_of_funds: formData["source_of_funds"],
      employment_status: formData["employment_status"],
    },
  }

  const ok = await createIdentity(body)
  .then(() => fetchProfile())
  .then(() => true)
  .catch((err) => {
    toast(err.message, {id})
    return false
  })

  queryClient.invalidateQueries({ queryKey: ['transaction'] })
  queryClient.removeQueries({ queryKey: ['wallet', 'list'] })
  queryClient.invalidateQueries({ queryKey: ['wallet'] })

  return ok ? redirect("/home") : {ok}
}