import { FC } from "react";
import style from "./style.module.scss";

interface CloseFriendProps {
  user: {
    id: number;
    profilePicture: string;
    username: string;
  };
}

const CloseFriend: FC<CloseFriendProps> = ({ user }) => {
  return (
    <li className={style.sidebarFriend}>
      <img
        className={style.sidebarFriendImg}
        src={user.profilePicture}
        alt=""
      />
      <span className={style.sidebarFriendName}>{user.username}</span>
    </li>
  );
};

export default CloseFriend;
