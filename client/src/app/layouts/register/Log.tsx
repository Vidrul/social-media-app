import { FC, useState } from "react";
import LoginForm from "../../components/ui/forms/loginForm/LoginForm";
import RegisterForm from "../../components/ui/forms/registerForm/RegisterForm";
import style from "./style.module.scss";

const Log: FC = () => {
  const [type, setType] = useState("login");
  const handleClick = () => {
    setType((prevState) => (prevState === "login" ? "register" : "login"));
  };

  return (
    <div className={style.login}>
      {type === "login" ? <LoginForm /> : <RegisterForm />}
      <div className={style.form__type}>
        {type === "login"
          ? "Don't you have an account? Please register"
          : "Do you already have an account? Please login"}
        {"  "}
        <button onClick={handleClick}>here</button>.
      </div>
    </div>
  );
};

export default Log;
