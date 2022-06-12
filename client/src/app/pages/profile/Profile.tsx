import { FC, useState } from "react";
import Modal from "../../components/common/modal/Modal";
import ProfileFeed from "../../components/ui/profileFeed/ProfileFeed";
import SideBar from "../../components/ui/sideBar/SideBar";
import TopBar from "../../components/ui/topBar/TopBar";
import RightBar from "../../layouts/rightBar/RightBar";
import EditForm from "../../components/ui/forms/editForm/EditForm";
import style from "./style.module.scss";
import useUser from "../../hooks/useUser";
import { useAppSelector } from "../../hooks/useStore";
import { $CombinedState } from "@reduxjs/toolkit";
import { useParams } from "react-router-dom";

const Profile: FC = () => {
  const { userId } = useParams();
  const { auth } = useAppSelector((data) => data.authUser);
  const [isModalOpen, setModalOpen] = useState(false);
  const { userData, isLoading } = useUser();

  const hanldeModal = () => {
    setModalOpen((prevState) => !prevState);
  };

  return (
    <>
      <TopBar />
      <div className={style.profile}>
        <SideBar />
        <div className={style.profileRight}>
          <div className={style.profileRightTop}>
            <div className={style.profileCover}>
              <div className={style.profileCoverImg__wrapper}>
                {userData?.coverPicture && (
                  <img
                    className={style.profileCoverImg}
                    src={userData?.coverPicture}
                    alt=""
                  />
                )}
              </div>
              <img
                className={style.profileUserImg}
                src={userData?.profilePicture}
                alt=""
              />
              {auth === userId && (
                <button className={style.editBtn} onClick={hanldeModal}>
                  Change profile
                </button>
              )}
            </div>
            <div className={style.profileInfo}>
              <h4 className={style.profileInfoName}>
                {`${userData?.firstName} ${userData?.lastName}`}
              </h4>
              <span className={style.profileInfoDesc}>{userData?.desc}</span>
            </div>
          </div>
          <div className={style.profileRightBottom}>
            <ProfileFeed />
            <RightBar profile={true} />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={hanldeModal} hide={isModalOpen}>
          <EditForm onClose={hanldeModal} userData={userData} />
        </Modal>
      )}
    </>
  );
};

export default Profile;
