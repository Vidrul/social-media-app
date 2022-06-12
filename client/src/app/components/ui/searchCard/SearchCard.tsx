import { FC } from "react";
import { Link } from "react-router-dom";
import style from "./style.module.scss";

interface SearchCardProps {
  img: string;
  name: string;
  lastName: string;
  userId: number;
}

const SearchCard: FC<SearchCardProps> = ({ name, img, lastName, userId }) => {
  return (
    <Link
      to={`/profile/${userId}`}
      className={style.searchCard}
    >
      <img src={img} alt="" className={style.searchCard__img} />
      <span className={style.searchCard__name}>{`${name} ${lastName}`}</span>
    </Link>
  );
};

export default SearchCard;
