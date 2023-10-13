import { 
  Outlet, 
  redirect 
} from 'react-router-dom'
import Nav from './components/Nav'
import { local } from 'lib/storage'
import { isLoggedIn } from 'lib/auth'
import { isTokenExpired } from 'lib/validation'


function SetupLayout() {
	return (
    <>
      <Nav />
      <div className="max-w-screen-md mx-auto">
        <Outlet />
      </div>
    </>
	)
}

export default { 
  loader() {
    if (!isLoggedIn())
      return redirect("/signin")

    return {ok: true}
  }, 
  element: <SetupLayout /> 
}
