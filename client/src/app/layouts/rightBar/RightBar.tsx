import { FC } from "react";
import { useParams } from "react-router-dom";
import HomeRightbar from "../../components/ui/homeRightbar/HomeRightbar ";
import ProfileRightbar from "../../components/ui/profileRightbar/ProfileRightbar";
import style from "./style.module.scss";

const RightBar: FC = () => {
  const { userId } = useParams();
  return (
    <div className={style.rightbar}>
      <div className={style.rightbarWrapper}>
        {!userId ? <HomeRightbar /> : <ProfileRightbar />}
      </div>
    </div>
  );
};

export default RightBar;
