import { Link } from "react-router-dom"
import img404 from '@/assets/404.jpg'


export function NotFound() {
  return (
    <main className="text-center space-y-5 mb-6 
      px-7 max-w-screen-sm mx-auto">
      <div className="my-6 relative">
        <img src={img404} alt="404" width="250px" 
          className="mx-auto" 
        />
        <small className="text-xs text-center 
          text-gray-500">
          <a href="https://www.freepik.com/free-vector\
          /oops-404-error-with-broken-robot-concept\
          -illustration_8030430.htm#query=404&position\
          =0&from_view=search&track=sph&uuid=03789f41-\
          8a12-4d3a-b6ab-bc16884cfe49"
          > Image by storyset
          </a> on Freepik
        </small>
      </div>
      <h2 className="font-medium text-3xl px-12">
        We can't find the page you're looking for
      </h2>
      <p className="py-3">That link didn't work. 
        Perhaps you'd like to learn about crypto or 
        get help from Coinbase Support.
      </p>
      <Link to="/" className="primary-btn block">
        Go to homepage
      </Link>
    </main>
  )
}
