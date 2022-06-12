import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../../common/react-hook-form/input/Input";
import style from "./style.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IUserData } from "../../../../types/types";
import { PhotoCamera, CloseOutlined } from "@material-ui/icons";
import { queryClient } from "../../../../..";
import { useMutation } from "react-query";
import userService from "../../../../service/user.service";

const schema = yup.object({
  firstName: yup.string().required("First name is a required field"),
  lastName: yup.string().required("Second name is a required field"),
});

interface IEditFormProps {
  data?: IUserData;
  onClose: () => void;
  userData?: IUserData;
}

const EditForm: FC<IEditFormProps> = ({ onClose, userData }) => {
  const [shake, setShake] = useState(false);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    userData?.coverPicture || ""
  );
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    userData?.profilePicture || ""
  );
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: updateUser } = useMutation(
    async (payload: {
      firstName: string;
      lastName: string;
      city: string;
      from: string;
      profilePicture: string;
      coverPicture: string;
    }) => {
      await userService.updateUser(payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user");
      },
    }
  );

  useEffect(() => {
    if (coverImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageUrl(reader.result as string);
      };
      reader.readAsDataURL(coverImage);
    }
  }, [coverImage]);

  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  const removeCoverImg = () => {
    setCoverImage(null);
    if (coverImageUrl === userData?.coverPicture) {
      setCoverImageUrl("");
    } else {
      setCoverImageUrl(userData?.coverPicture || "");
    }
  };

  const animate = () => {
    setShake(true);
    setTimeout(() => setShake(false), 1000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    firstName: string;
    lastName: string;
    city: string;
    from: string;
  }>({
    defaultValues: {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      city: userData?.city,
      from: userData?.from,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {}, []);

  const onSubmit: SubmitHandler<{
    firstName: string;
    lastName: string;
    city: string;
    from: string;
  }> = async (data) => {
    updateUser({
      ...data,
      profilePicture: profileImageUrl,
      coverPicture: coverImageUrl,
    });

    onClose();
  };

  const onChangeCoverImage = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files && e.target.files[0];
    setCoverImage(image);
  };

  const onChangeCoverProfileImage = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files && e.target.files[0];
    setProfileImage(image);
  };

  return (
    <form
      className={style.editForm}
      onSubmit={handleSubmit(onSubmit)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={style.editFormHeader}>
        <CloseOutlined
          className={style.editFormHeader_close}
          onClick={onClose}
        />
        <div className={style.editFormHeader_title}>Change profile</div>
        <button className={style.editFormHeader_save} type="submit">
          Save
        </button>
      </div>
      <div className={style.formCover}>
        <div className={style.profileCoverImg__wrapper}>
          {coverImageUrl && (
            <img className={style.profileCoverImg} alt="" src={coverImageUrl} />
          )}
          <div className={style.profileCoverImg_settings}>
            <div
              className={style.settings_item}
              onClick={(e) => {
                e.preventDefault();
                coverImageInputRef.current?.click();
              }}
            >
              <PhotoCamera />
            </div>

            {coverImageUrl && (
              <div className={style.settings_item} onClick={removeCoverImg}>
                <CloseOutlined />
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={coverImageInputRef}
            onChange={onChangeCoverImage}
            style={{ display: "none" }}
          />
        </div>
        <div className={style.profileImage__wrapper}>
          <img className={style.profileImage} alt="" src={profileImageUrl} />
          <div className={style.profileImg_settings}>
            <div
              className={style.settings_item}
              onClick={(e) => {
                e.preventDefault();
                profileImageInputRef.current?.click();
              }}
            >
              <PhotoCamera />
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={profileImageInputRef}
            onChange={onChangeCoverProfileImage}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className={style.editFormMain}>
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
          name={"from"}
          type={"text"}
          placeholder={"From"}
          shake={shake}
        />

        <Input
          register={register}
          name={"city"}
          type={"text"}
          placeholder={"City"}
          shake={shake}
        />

        <div className={style.error__container}>
          <p className={`${style.error} ${shake ? style.shake : ""}`}></p>
        </div>
      </div>
    </form>
  );
};

export default EditForm;
