import * as React from 'react'
import { 
  useNavigate, 
  useRouteLoaderData 
} from "react-router-dom"
import { api } from 'lib/api'
import { signout } from 'lib/auth'
import { Button, Spinner } from '$/components'
import { updateUser, getUser } from 'lib/storage'


function Protected() {
  const [state, setState] = React.useState({error: null, status: ''})

  const dataRoute = useRouteLoaderData("dashboard")
  const navigate = useNavigate()

  React.useEffect(() => {
    const fetchResource = async () => {
      setState({status: 'loading'})
      try {
        const data = await api.get('/auth/profile')
        updateUser(data?.data)
        setState({status: 'success'})
      } catch (error) {
        setState({error, status: 'error'})
      } 
    }

    if (!getUser())
      fetchResource()
  }, [])

  // if (state.error)
  //   return <div className="text-lg text-center p-12">{state.error.message}</div>

  // if (state.status === 'loading')
  //   return <div className="mx-auto w-full h-screen text-center p-12 bg-slate-500"><Spinner /></div>

  return (
    <main className="md:min-h-[32rem] min-h-[20rem]">
      <p>Welcome </p>
      <pre>{JSON.stringify(getUser() ?? {profile: null}, null, 2)}</pre>
      <pre>{JSON.stringify(dataRoute?.data?.profile ?? {profile: null}, null, 2)}</pre>
      <Button 
        text="Sign Out"
        onClick={async () => {
          await signout(() => {
            navigate('/')
          }) 
        }} 
        className="bg-blue-500 rounded-lg px-4 py-2 text-white"
      />
    </main>
  )
}

export default { element: <Protected />}
