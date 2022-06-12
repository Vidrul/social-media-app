import { FC, useState } from "react";
import style from "./style.module.scss";
import { MoreVert } from "@material-ui/icons";
import { IPost } from "../../../types/types";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import { queryClient } from "../../../../index";
import userService from "../../../service/user.service";
import postService from "../../../service/post.service";
import { useAppSelector } from "../../../hooks/useStore";
import heart from "../../../../assets/heart.png";
import moment from "moment";

interface PostProps {
  post: IPost;
  index: number;
}

const Post: FC<PostProps> = ({ post, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth } = useAppSelector((data) => data.authUser);
  const { isLoading, data } = useQuery(["user", post.userId], async () => {
    const data = await userService.getUser(String(post.userId));
    return data;
  });

  const { status, mutateAsync: removePost } = useMutation(
    async () => {
      await postService.removePost(String(post.id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userPosts");
      },
    }
  );

  const { mutateAsync: likePost } = useMutation(
    async () => {
      await postService.likePost(String(post.id));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("allUserAndFollowingPosts");
        queryClient.invalidateQueries("userPosts");
      },
    }
  );

  const handleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const handleRemove = () => {
    setIsModalOpen((prevState) => !prevState);
    removePost();
  };

  const handleLikePost = () => {
    likePost();
  };

  return (
    <div className={style.post}>
      <div className={style.postWrapper}>
        <div className={style.postTop}>
          <div className={style.postTopLeft}>
            <img
              className={style.postProfileImg}
              src={data?.profilePicture || ""}
              alt=""
            />
            <span className={style.postUsername}>{data?.firstName}</span>
            <span className={style.postDate}>
              {moment(post.create_date).fromNow()}
            </span>
          </div>
          {auth === String(post.userId) && (
            <div className={style.postTopRight}>
              <MoreVert onClick={handleModal} />
              <div
                className={`${style.settings__wrapper} ${
                  isModalOpen ? null : style.hidden
                }`}
                onClick={handleModal}
              ></div>
              <div
                className={`${style.settings} ${
                  isModalOpen ? null : style.hidden
                }`}
              >
                <div className={style.btn} onClick={handleRemove}>
                  DELETE
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={style.postCenter}>
          <span className={style.postText}>{post?.desc}</span>
          <img className={style.postImg} src={post.img} alt="" />
        </div>
        <div className={style.postBottom}>
          <div className={style.postBottomLeft}>
            <img
              className={style.likeIcon}
              src={heart}
              onClick={handleLikePost}
              alt=""
            />
            <span className={style.postLikeCounter}>
              {post.likes.length} people like it
            </span>
          </div>
          <div className={style.postBottomRight}>
            <span className={style.postCommentText}>{"comments"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
