import { FC } from "react";
import style from "./style.module.scss";

interface IFormProps {
  onSubmit: () => void;
}

const Form: FC<IFormProps> = ({ children, onSubmit }) => {
  return (
    <form autoComplete={"off"} onSubmit={onSubmit} className={style.form_container }>
      {children}
    </form>
  );
};

export default Form;
