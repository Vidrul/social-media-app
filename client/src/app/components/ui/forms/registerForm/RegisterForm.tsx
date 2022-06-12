import { ChangeEvent, FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Form from "../form/Form";
import Input from "../../../common/react-hook-form/input/Input";
import style from "./style.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IPayloadSignUp } from "../../../../types/types";
import { useAppDispatch, useAppSelector } from "../../../../hooks/useStore";
import { signUp } from "../../../../store/actions/authUserActions";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup.string().required("Email is a required field").email(),
  firstName: yup.string().required("First name is a required field"),
  lastName: yup.string().required("Second name is a required field"),
  password: yup.string().required("Password is a required field").min(8),
});

const RegisterForm: FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((data) => data.authUser);
  const [image, setImage] = useState<File | null>();
  const [preview, setPreview] = useState<string>("");
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const animate = () => {
    setShake(true);
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();

      reader.readAsDataURL(image);

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
    } else {
      setPreview("");
    }
  }, [image]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPayloadSignUp>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IPayloadSignUp> = async (data) => {
    await dispatch(signUp({ ...data, image: preview })).then(() => {
      navigate("/");
    });
  };

  const onChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files && e.target.files[0];
    setImage(image);
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
        register={register}
        name={"email"}
        type={"text"}
        placeholder={"Email"}
        error={errors.email}
        shake={shake}
      />

      <Input
        register={register}
        name={"firstName"}
        type={"text"}
        placeholder={"First name"}
        error={errors.firstName}
        shake={shake}
      />

      <Input
        register={register}
        name={"lastName"}
        type={"text"}
        placeholder={"Last name"}
        error={errors.lastName}
        shake={shake}
      />

      <Input
        register={register}
        name={"password"}
        type={"text"}
        placeholder={"Password"}
        error={errors.password}
        shake={shake}
      />

      <div className={style.error__container}>
        <p className={`${style.error} ${shake ? style.shake : ""}`}>{error}</p>
      </div>

      <button className={style.loginButton} onClick={animate} type="submit">
        submit
      </button>
    </Form>
  );
};

export default RegisterForm;
