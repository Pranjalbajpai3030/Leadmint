
import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Temporarily bypassing authentication check
  return <Outlet />;
};

export default ProtectedRoute;
