import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "../redux/hooks/hooks";
import { RootState } from "../redux/store/store";
import PageNotFound from "../components/MySite/PageNotFound";

type Role = "Admin" | "Vendor" | "Customer" | "";

const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: Role[];
}) => {
  const { isAuthenticated, role } = useAppSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <PageNotFound />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
