import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import assetImg from '@/assets/connection-issue.png'
import {NotFound} from './NotFound'


const RootBoundary: React.FC = () => 
{
  const error = useRouteError()
  console.warn('Catch by RootBoundary', error)
  let message = "Something went wrong"
  let subMsg = "Perhaps you'd like to get help from Coinbase Support."

  if (isRouteErrorResponse(error))
    if (error.status >= 500) {
      message = "We're having connection issues"
      subMsg = "We're looking into it right now. Plese try again later. Your funds are safe."
    }

    else if (error.status == 404)
      return <NotFound />

  return (
    <main className="text-center m-6 
      px-7 max-w-screen-sm mx-auto">
      <span className="my-6">
        <img src={assetImg} 
          alt="connection issues" 
          className="mx-auto" 
        />
      </span>
      <h2 className="font-medium text-2xl py-3 px-12">
        {message}
      </h2>
      <p className="pb-5 px-5">
        {subMsg}
      </p>
      <Link to="." relative="path" className="primary-btn block mx-auto w-fit">
        Reload
      </Link>
    </main>
  )
}


export default RootBoundary