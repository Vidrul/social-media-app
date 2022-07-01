import { FC } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/useStore";
import userService from "../../../service/user.service";
import List from "../../common/list/List";
import style from "./style.module.scss";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";
import { followOrUnfollowToUser } from "../../../store/actions/authUserActions";
import useUser from "../../../hooks/useUser";
import { createConversation } from "../../../store/actions/conversationActions";

const ProfileRightbar: FC = () => {
  const navigate = useNavigate();
  let { userId } = useParams();
  const dispatch = useAppDispatch();
  const {
    data: authUser,
    isLoading: authUserIsLoading,
    auth,
  } = useAppSelector((data) => data.authUser);

  const { isLoading, data } = useQuery(["followingUsers", userId], async () => {
    const { array } = await userService.getFollowings(userId || "");
    return array;
  });

  const { userData, isLoading: userDataIsLoading } = useUser();

  const handleFollow = () => {
    dispatch(followOrUnfollowToUser({ userId: userId || "" }));
  };

  const startChatting = () => {
    dispatch(createConversation(userId || "")).then(() => {
      navigate("/messanger");
    });
  };

  return (
    <>
      {auth !== userId && !authUserIsLoading && (
        <button className={style.btn} onClick={handleFollow}>
          {authUser.followings.includes(userId || "") ? (
            <>
              <span>Unfollow</span> <RemoveCircleOutline />
            </>
          ) : (
            <>
              <span>Follow</span> <AddCircleOutline />
            </>
          )}
        </button>
      )}
      {auth !== userId && (
        <button onClick={startChatting} className={style.btn}>
          start chatting
        </button>
      )}
      <h4 className={style.rightbarTitle}>User information</h4>
      <div className={style.rightbarInfo}>
        <div className={style.rightbarInfoItem}>
          <span className={style.rightbarInfoKey}>City: </span>
          <span className={style.rightbarInfoValue}>
            {userData?.city ? userData?.city : "not specify"}
          </span>
        </div>
        <div className={style.rightbarInfoItem}>
          <span className={style.rightbarInfoKey}>From:</span>
          <span className={style.rightbarInfoValue}>
            {userData?.from ? userData?.from : "not specify"}
          </span>
        </div>
      </div>
      <h4 className={style.rightbarTitle}>My followings</h4>
      <div className={style.rightbarFollowings}>
        {!isLoading && (
          <List
            items={data || []}
            renderItem={(item) => (
              <Link
                to={`/profile/${item.id}`}
                className={style.rightbarFollowing}
              >
                <img
                  src={item.profilePicture}
                  alt=""
                  className={style.rightbarFollowingImg}
                />
                <span className={style.rightbarFollowingName}>
                  {item.username}
                </span>
              </Link>
            )}
          />
        )}
      </div>
    </>
  );
};

export default ProfileRightbar;
