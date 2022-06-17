import { FC } from "react";
import { useAppSelector } from "../../../hooks/useStore";
import style from "./style.module.scss";
import moment from "moment";
import { useQuery } from "react-query";
import userService from "../../../service/user.service";

interface MessageProps {
  message: {
    id?: number;
    sender: number;
    text: string;
    create_date: string;
  };
}

const Message: FC<MessageProps> = ({ message }) => {
  const { auth } = useAppSelector((data) => data.authUser);
  const { data: userData } = useQuery(["user", message], async () => {
    const data = userService.getUser(String(message.sender));
    return data;
  });

  return (
    <div
      className={`${style.message} ${
        String(message.sender) === auth ? `${style.own}` : ""
      }`}
    >
      <div className={style.messageTop}>
        <img
          className={style.messageImg}
          src={userData?.profilePicture}
          alt=""
        />
        <p className={style.messageText}>{message.text}</p>
      </div>
      <div className={style.messageBottom}>
        {moment(message.create_date).fromNow()}
      </div>
    </div>
  );
};

export default Message;
