import { ChangeEvent, FC, useState } from "react";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import style from "./style.module.scss";
import { Link } from "react-router-dom";
import localStorageService from "../../../service/localStorage.service";
import { useAppSelector } from "../../../hooks/useStore";
import { useQuery } from "react-query";
import userService from "../../../service/user.service";
import List from "../../common/list/List";
import SearchCard from "../searchCard/SearchCard";
import Loader from "../../common/loader/Loader";

const TopBar: FC = () => {
  const { data } = useAppSelector((data) => data.authUser);
  const [isFocused, setFocused] = useState(false);
  const [inputData, setInputData] = useState("");
  const { data: users, isLoading } = useQuery(
    ["users", inputData],
    async () => {
      const { data } = await userService.getUsers(inputData || "_");
      return data;
    },
    { cacheTime: 0 }
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setInputData(value);
  };

  const onFocus = () => {
    setFocused(true);
  };

  const onBlur = (e: any) => {
    setTimeout(() => {
      setFocused(false);
    }, 100);
  };

  return (
    <nav className={style.topbarContainer}>
      <div className={style.topbarLeft}>
        <Link to={"/"} className={style.logo}>
          VidRULsocial
        </Link>
      </div>
      <div className={style.topbarCenter}>
        <div className={style.searchbar}>
          <Search className={style.searchIcon} />
          <input
            placeholder="Search for friends..."
            className={style.searchInput}
            onChange={onChange}
            value={inputData}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        {isFocused && (
          <div className={style.downDrop}>
            {isLoading ? (
              <div className={style.downDrop__loader_wrraper}>
                <Loader />
              </div>
            ) : (
              <>
                {users?.length === 0 ? (
                  <div className={style.empty}>
                    <Search className={style.empty__img} />
                    <span>Find friends maybe...</span>
                  </div>
                ) : (
                  <List
                    items={users || []}
                    renderItem={(user) => (
                      <SearchCard
                        img={user.profilePicture}
                        name={user.firstName}
                        lastName={user.lastName}
                        userId={user.id}
                      />
                    )}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className={style.topbarRight}>
        <div className={style.topbarLinks}>
          <Link to={"/"} className={style.topbarLink}>
            Homepage
          </Link>
          <span className={style.topbarLink}>Timeline</span>
        </div>
        <div className={style.topbarIcons}>
          <div className={style.topbarIconItem}>
            <Person />
            <span className={style.topbarIconBadge}>1</span>
          </div>
          <div className={style.topbarIconItem}>
            <Chat />
            <span className={style.topbarIconBadge}>2</span>
          </div>
          <div className={style.topbarIconItem}>
            <Notifications />
            <span className={style.topbarIconBadge}>1</span>
          </div>
        </div>
        <Link to={`/profile/${localStorageService.getUserId()}`}>
          <img src={data.profilePicture} alt="" className={style.topbarImg} />
        </Link>
      </div>
    </nav>
  );
};

export default TopBar;
