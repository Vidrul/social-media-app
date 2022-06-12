import { FC, ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useStore";

interface RequireAturhProps {
  children: ReactElement;
}

const RequireAturh: FC<RequireAturhProps> = ({ children }) => {
  const location = useLocation();
  const { auth } = useAppSelector((store) => store.authUser);

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default RequireAturh;
