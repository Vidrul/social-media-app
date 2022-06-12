import { FC } from "react";
import HomeRightbar from "../../components/ui/homeRightbar/HomeRightbar ";
import ProfileRightbar from "../../components/ui/profileRightbar/ProfileRightbar";
import style from "./style.module.scss";

interface RightBarProps {
    profile: boolean;
}

const RightBar: FC<RightBarProps> = ({ profile }) => {
  return (
    <div className={style.rightbar}>
      <div className={style.rightbarWrapper}>
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default RightBar;
