import { ChangeEvent, FC } from "react";
import style from "./style.module.scss";
import { IoSearch } from "react-icons/io5";

interface IProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
}

const Input: FC<IProps> = ({ onChange, value, placeholder }) => {
  return (
    <div className={style.input}>
      <input onChange={onChange} value={value} placeholder={placeholder} />
      <div className={style.input__img}>
        <IoSearch />
      </div>
    </div>
  );
};

export default Input;
