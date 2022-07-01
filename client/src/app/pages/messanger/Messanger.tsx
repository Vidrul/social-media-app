import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import TopBar from "../../components/ui/topBar/TopBar";
import Conversation from "../../components/ui/conversation/Conversation";
import { useMutation, useQuery } from "react-query";
import chatService from "../../service/chat.service";
import Message from "../../components/ui/message/Message";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { setConversation } from "../../store/reducers/сonversationSlice";

const Messanger: FC = () => {
  const dispatch = useAppDispatch();
  const messageRef = useRef<HTMLDivElement | null>(null);
  const { auth } = useAppSelector((data) => data.authUser);
  const { currentConversation } = useAppSelector((data) => data.currentChat);
  const [messageText, setMessageText] = useState<string | null>(null);
  const [friendsQuery, setFriendsQuery] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    {
      id?: number;
      sender: number;
      text: string;
      create_date: string;
    }[]
  >();

  const socket = useRef<any>();

  const { data: conversations } = useQuery("conversations", async () => {
    const data = await chatService.getConversations();
    return data.conversations;
  });

  const { isLoading } = useQuery(
    ["messages", currentConversation],
    async () => {
      if (currentConversation) {
        const data = await chatService.getMessages(
          String(currentConversation.id)
        );
        setMessages(data.messages);
      } else {
        return;
      }
    }
  );

  const { status: createNewMessageStatus, mutateAsync: createNewMessage } =
    useMutation(async () => {
      socket.current.emit("sendMessage", {
        sender: auth,
        conversationId: currentConversation?.id,
        text: messageText,
      });

      await chatService.createMessage({
        text: messageText,
        conversationId: String(currentConversation?.id),
      });

      setMessageText(null);
    });

  const handleMessageTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const handleQueryFriendsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFriendsQuery(e.target.value);
  };

  useEffect(() => {
    socket.current = io("http://localhost:8080/");
    socket.current.on(
      "getMessage",
      (data: { sender: number; text: string; create_date: string }) => {
        setMessages((prevState) => {
          if (prevState) {
            return [...prevState, data];
          }

          return prevState;
        });
      }
    );
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", auth);
  }, [auth]);

  useEffect(() => {
    socket.current.emit("joinConversation", {
      conversationId: currentConversation?.id,
    });
  }, [currentConversation]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isValid = () => {
    if (!messageText?.trim() || createNewMessageStatus === "loading") {
      return true;
    }
  };

  return (
    <>
      <TopBar />
      <div className={style.messenger}>
        <div className={style.chatMenu}>
          <div className={style.chatMenuWrapper}>
            <input
              placeholder="Search for friends"
              className={style.chatMenuInput}
              name={"friendsQuery"}
              value={friendsQuery || ""}
              onChange={handleQueryFriendsChange}
            />

            {conversations?.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  dispatch(setConversation(c));
                }}
              >
                <Conversation conversation={c.members} />
              </div>
            ))}
          </div>
        </div>
        <div className={style.chatBox}>
          <div className={style.chatBoxWrapper}>
            {currentConversation ? (
              <>
                <div className={style.chatBoxTop}>
                  {messages?.map((m, i) => (
                    <div key={i} ref={messageRef}>
                      <Message message={m} />
                    </div>
                  ))}
                </div>
                <form
                  className={style.chatBoxBottom}
                  onSubmit={(e) => {
                    e.preventDefault();
                    createNewMessage();
                  }}
                >
                  <input
                    className={style.chatMessageInput}
                    placeholder="write something..."
                    onChange={handleMessageTextChange}
                    name={"messageText"}
                    value={messageText || ""}
                  />
                  <button
                    disabled={isValid() ? true : false}
                    className={style.chatSubmitButton}
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <span className={style.noConversationText}>
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messanger;
