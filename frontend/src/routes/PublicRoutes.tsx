import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks/hooks";
import { RootState } from "../redux/store/store";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAppSelector(
    (state: RootState) => state.auth,
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
