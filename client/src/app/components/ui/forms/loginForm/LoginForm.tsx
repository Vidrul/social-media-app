import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Form from "../form/Form";
import style from "./style.module.scss";
import Input from "../../../common/react-hook-form/input/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/useStore";
import { signIn } from "../../../../store/actions/authUserActions";
import { IPayloadLogin } from "../../../../types/types";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup.string().required("Email is a required field").email(),
  password: yup.string().required("Password is a required field").min(8),
});

const LoginForm: FC = () => {
  const dispatch = useAppDispatch();
  // const { error } = useAppSelector((data) => data.user);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPayloadLogin>({
    resolver: yupResolver(schema),
  });

  const animate = () => {
    setShake(true);
  };

  const onSubmit: SubmitHandler<IPayloadLogin> = (data) => {
    dispatch(signIn(data))
      .then(() => {
        console.log("then");

        navigate("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShake(false);
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [shake]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type={"text"}
        register={register}
        name={"email"}
        placeholder={"Email"}
        error={errors.email}
        shake={shake}
      />
      <Input
        type={"text"}
        register={register}
        name={"password"}
        placeholder={"Password"}
        error={errors.password}
        shake={shake}
      />

      <button onClick={animate} className={style.loginButton}>
        Sign In
      </button>
    </Form>
  );
};

export default LoginForm;
