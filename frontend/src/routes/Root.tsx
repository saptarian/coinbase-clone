import Signin from '$/pages/Signin'
import Signup from '$/pages/Signup'
import Explore from '$/pages/Explore'
import NotFound from '$/pages/NotFound'

export const RootRoutes = [
  { path: "*", ...NotFound, },
  { index: true, ...Explore, },
  { path: "signin", ...Signin, },
  { path: "signup", ...Signup, },
]