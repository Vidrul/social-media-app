import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import { PermMedia, Label, Room, EmojiEmotions } from "@material-ui/icons";
import { useAppSelector } from "../../../hooks/useStore";
import postService from "../../../service/post.service";
import { useMutation } from "react-query";
import { queryClient } from "../../../..";
import { CloseOutlined } from "@material-ui/icons";

const Share: FC = () => {
  const { data } = useAppSelector((data) => data.authUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const { firstName, profilePicture } = data;
  const { status, mutateAsync: addNewPost } = useMutation(
    async () => {
      await postService.createPost({ desc: desc, img: preview }).then(() => {
        setDesc("");
        setPreview("");
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userPosts");
      },
    }
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDesc(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addNewPost();
  };

  const handlerImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file && file.type.substr(0, 5) === "image") {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  const removeFile = () => {
    setPreview("");
    setImage(null);
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      // setPreview(null);
    }
  }, [image]);

  return (
    <div className={style.share}>
      <div className={style.shareWrapper}>
        <form className={style.shareTop} onSubmit={handleSubmit}>
          <img className={style.shareProfileImg} src={profilePicture} alt="" />
          <input
            placeholder={`What's in your mind ${firstName}?`}
            className={style.shareInput}
            value={desc}
            onChange={handleChange}
          />
          <button
            className={style.shareButton}
            disabled={status === "loading" || (!desc && !preview)}
          >
            Share
          </button>
        </form>
        <hr className={style.shareHr} />
        <div className={style.shareImgContainer}>
          {preview && (
            <div className={style.closeBtn} onClick={removeFile}>
              <CloseOutlined />
            </div>
          )}
          <img src={preview || ""} alt="" className={style.shareImg} />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onClick={(e) => {
              e.currentTarget.value = "";
            }}
            onChange={handlerImage}
            style={{ display: "none" }}
          />
        </div>
        <div className={style.shareBottom}>
          <div className={style.shareOptions}>
            <div
              className={style.shareOption}
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              <PermMedia htmlColor="tomato" className={style.shareIcon} />
              <span className={style.shareOptionText}>Photo or Video</span>
            </div>
            <div className={style.shareOption}>
              <Label htmlColor="blue" className={style.shareIcon} />
              <span className={style.shareOptionText}>Tag</span>
            </div>
            <div className={style.shareOption}>
              <Room htmlColor="green" className={style.shareIcon} />
              <span className={style.shareOptionText}>Location</span>
            </div>
            <div className={style.shareOption}>
              <EmojiEmotions
                htmlColor="goldenrod"
                className={style.shareIcon}
              />
              <span className={style.shareOptionText}>Feelings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
