import { FC, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import style from "./style.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  register: any;
  name: string;
  placeholder: string;
  error?: FieldError;
  shake: boolean;
}

const Input: FC<InputProps> = ({
  type,
  register,
  name,
  placeholder,
  error,
  shake,
}) => {
  return (
    <div className={style.wrapper}>
      <input
        className={style.input}
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />

      <div className={`${style.error} ${shake ? style.shake : ""}`}>
        {error?.message}
      </div>
    </div>
  );
};

export default Input;
