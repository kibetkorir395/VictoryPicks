import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/atoms';

const ProtectedRoute = ({ children }) => {
  const user = useRecoilValue(userState);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          redirectTo: location.pathname, // "/subscribe"
          originalState: location.state  // { from: ..., subscription: { ... } }
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
