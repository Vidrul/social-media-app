import { FC } from "react";
import style from "./style.module.scss";

interface OnlineProps {
  user: {
    username: string;
    profilePicture: string;
  };
}

const Online: FC<OnlineProps> = ({ user }) => {
  return (
    <li className={style.rightbarFriend}>
      <div className={style.rightbarProfileImgContainer}>
        <img
          className={style.rightbarProfileImg}
          src={user.profilePicture}
          alt=""
        />
        <span className={style.rightbarOnline}></span>
      </div>
      <span className={style.rightbarUsername}>{user.username}</span>
    </li>
  );
};

export default Online;
