import { FC } from "react";
import Share from "../share/Share";
import style from "./style.module.scss";
import List from "../../common/list/List";
import Post from "../post/Post";
import postService from "../../../service/post.service";
import { useQuery } from "react-query";

const Feed: FC = () => {
  const { isLoading, data } = useQuery("allUserAndFollowingPosts", async () => {
    const { posts } = await postService.getAllUserAndFollowingsPosts();
    return posts;
  });

  console.log(data);

  return (
    <div className={style.feed}>
      <div className={style.feedWrapper}>
        <Share />
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

export default Feed;
