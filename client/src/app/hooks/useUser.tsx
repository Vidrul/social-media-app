import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import userService from "../service/user.service";

const useUser = () => {
  const { userId } = useParams();
  const { data: userData, isLoading } = useQuery(["user", userId], async () => {
    const data = await userService.getUser(userId || "");
    return data;
  });

  return { userData, isLoading };
};

export default useUser;
