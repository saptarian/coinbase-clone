import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import assetImg from '@/assets/connection-issue.jpg'


const Problem: React.FC = () => 
{
  const error = useRouteError()
  let message = "Something went wrong"
  // console.log(error)

  if (isRouteErrorResponse(error))
    if (error.status >= 500) {
      message = "We're having connection issues"
  }

  return (
    <main className="grow bg-white">
      <div className="w-[25rem] mx-auto text-center">
        <div className="py-1">
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
        </div>
        <h2 className="font-medium text-2xl py-5">
          {message}
        </h2>
        <p className="py-1 px-5">
          We're looking into it right now. 
          Plese try again later. Your funds are safe.
        </p>
      </div>
    </main>
  )
}


export default Problem