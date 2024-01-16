import { Link } from "react-router-dom"
import img404 from '@/assets/78f98b1dc6c55f9a.png'


export function NotFound() {
  return (
    <main className="text-center space-y-5 mb-6 
      px-7 max-w-screen-sm mx-auto">
      <div className="my-6">
        <img src={img404} alt="404" width="250px" 
          className="mx-auto" 
        />
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
