import { FC } from "react";
import style from "./style.module.scss";

const Loader: FC = () => {
  return (
    <div className={style.lds_ripple}>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
