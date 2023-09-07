import { type ReactElement } from 'react';
import { Navigate } from 'react-router';
import useAuthStore from 'root/store/useAuthStore';

interface Props {
  children: ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  // Replace with your auth condition

  const { isAuthenticated } = useAuthStore((state) => state);

  console.log(isAuthenticated, "isAuthenticated")
  // console.log("children", children)

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
