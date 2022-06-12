import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useStore";
import { getUserData } from "../../../store/actions/authUserActions";

const AppLoader: FC = ({ children }) => {
  const { isLoggedIn } = useAppSelector((data) => data.authUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserData());
    }
  }, [dispatch, isLoggedIn]);

  return <>{children}</>;
};

export default AppLoader;
