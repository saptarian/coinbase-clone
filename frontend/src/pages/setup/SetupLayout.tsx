import { Outlet } from 'react-router-dom'
import Nav from './components/Nav'


export function SetupLayout() {
	return (
    <>
      <Nav />
      <div className="max-w-screen-md mx-auto">
        <Outlet />
      </div>
    </>
	)
}
