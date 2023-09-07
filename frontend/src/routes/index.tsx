import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Signup from '../pages/Signup'
import Signin from '../pages/Signin'
import Explore from '../pages/Explore'
import NotFound from '../pages/NotFound'
import Protected from '../pages/Protected'
import PrivateRoute from './PrivateRoute'

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Explore/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/explore" element={<Explore/>}/>
      <Route path="/protected" element={
        <PrivateRoute> <Protected/> </PrivateRoute>
      }/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  </BrowserRouter>
)

export default Router
