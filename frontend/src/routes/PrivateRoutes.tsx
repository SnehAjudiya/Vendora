import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks/hooks";
import { RootState } from "../redux/store/store";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAppSelector(
    (state: RootState) => state.auth,
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
