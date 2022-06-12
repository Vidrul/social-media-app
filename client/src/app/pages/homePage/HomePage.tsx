import { FC } from "react";
import Feed from "../../components/ui/feed/Feed";
import SideBar from "../../components/ui/sideBar/SideBar";
import TopBar from "../../components/ui/topBar/TopBar";
import RightBar from "../../layouts/rightBar/RightBar";
import style from "./style.module.scss";

const HomePage: FC = () => {
  return (
    <>
      <TopBar />
      <div className={style.homeContainer}>
        <SideBar />
        <Feed />
        <RightBar profile={false} />
      </div>
    </>
  );
};

export default HomePage;
