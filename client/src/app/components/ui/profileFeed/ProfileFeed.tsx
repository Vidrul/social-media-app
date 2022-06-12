import { FC } from "react";
import Share from "../share/Share";
import style from "./style.module.scss";
import List from "../../common/list/List";
import Post from "../post/Post";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import postService from "../../../service/post.service";
import { useAppSelector } from "../../../hooks/useStore";

const ProfileFeed: FC = () => {
  const { userId } = useParams();
  const { auth } = useAppSelector((data) => data.authUser);
  const { isLoading, data } = useQuery(["userPosts", userId], async () => {
    const { posts } = await postService.getAllUserPosts(userId || "");
    return posts;
  });

  return (
    <div className={style.feed}>
      <div className={style.feedWrapper}>
        {userId === auth && <Share />}
        <List
          items={data || []}
          renderItem={(item, index) => {
            return <Post post={item} index={index} />;
          }}
        />
      </div>
    </div>
  );
};

export default ProfileFeed;
