import { FC } from "react";
import { Users } from "../../../dummyData";
import List from "../../common/list/List";
import Online from "../online/Online";
import style from "./style.module.scss";

const HomeRightbar: FC = () => {
  return (
    <div className={style.birthdayContainer}>
      <h4 className={style.rightbarTitle}>Online Friends</h4>
      <ul className={style.rightbarFriendList}>
        <List
          items={Users}
          renderItem={(u) => <Online key={u.id} user={u} />}
        />
      </ul>
    </div>
  );
};

export default HomeRightbar;
