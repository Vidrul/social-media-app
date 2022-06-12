import { FC } from "react";
import style from "./style.module.scss";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";
import { Users } from "../../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import List from "../../common/list/List";

const SideBar: FC = () => {
  return (
    <div className={style.sidebar}>
      <div className={style.sidebarWrapper}>
        <ul className={style.sidebarList}>
          <li className={style.sidebarListItem}>
            <RssFeed className={style.sidebarIcon} />
            <span className={style.sidebarListItemText}>Feed</span>
          </li>
          <li className={style.sidebarListItem}>
            <Chat className={style.sidebarIcon} />
            <span className={style.sidebarListItemText}>Chats</span>
          </li>
          <li className={style.sidebarListItem}>
            <PlayCircleFilledOutlined className={style.sidebarIcon} />
            <span className={style.sidebarListItemText}>Videos</span>
          </li>
          <li className={style.sidebarListItem}>
            <Group className={style.sidebarIcon} />
            <span className={style.sidebarListItemText}>Groups</span>
          </li>
          <li className={style.sidebarListItem}>
            <Bookmark className={style.sidebarIcon} />
            <span className={style.sidebarListItemText}>Bookmarks</span>
          </li>
          <li className={style.sidebarListItem}>
            <HelpOutline className={style.sidebarIcon} />
            <span className={style.sidebarListItemText}>Questions</span>
          </li>
          <li className={style.sidebarListItem}>
            <WorkOutline className={style.sidebarIcon} />
            <span className={style.sidebarListItemText}>Jobs</span>
          </li>
          <li className={style.sidebarListItem}>
            <Event className={style.sidebarIcon} />
            <span className={style.sidebarListItemText}>Events</span>
          </li>
          <li className={style.sidebarListItem}>
            <School className={style.sidebarIcon} />
            <span className={style.sidebarListItemText}>Courses</span>
          </li>
        </ul>
        <button className={style.sidebarButton}>Show More</button>
        <hr className={style.sidebarHr} />
        <ul className={style.sidebarFriendList}>
          <List
            items={Users}
            renderItem={(u) => <CloseFriend key={u.id} user={u} />}
          />
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
