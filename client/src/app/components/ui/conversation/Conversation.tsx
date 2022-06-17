import { FC } from "react";
import { useQuery } from "react-query";
import { useAppSelector } from "../../../hooks/useStore";
import userService from "../../../service/user.service";
import style from "./style.module.scss";

interface ConversationProps {
  conversation: string[];
}

const Conversation: FC<ConversationProps> = ({ conversation }) => {
  const { auth } = useAppSelector((data) => data.authUser);
  const friendId = conversation.find((m) => m !== auth);

  const { data } = useQuery(["chatMember", friendId], async () => {
    const data = userService.getUser(friendId || "");
    return data;
  });

  return (
    <div className={style.conversation}>
      <img
        className={style.conversationImg}
        src={data?.profilePicture}
        alt=""
      />
      <span className={style.conversationName}>
        {data?.firstName} {data?.lastName}
      </span>
    </div>
  );
};

export default Conversation;
