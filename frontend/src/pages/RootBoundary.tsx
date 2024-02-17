import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import assetImg from '@/assets/connection-issue.jpg'
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
          className="mx-auto h-[calc(100vh-350px)]" 
        />
        <small className="text-xs text-center 
          text-gray-500">
          Image by <a href={"https://www.freepik.com/free-vector"
          + "/hand-drawn-no-data-illustration_49639852.htm#"
          + "query=connection%20issue&position=44&from_view=search"
          + "&track=ais&uuid=523a92a4-b18b-4bb5-a6c3-2e42a94bacb5"}
          target="_blank"
          >Freepik</a>
        </small>
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