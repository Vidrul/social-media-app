import { ChangeEvent, FC, useRef } from "react";
import style from "./style.module.scss";

interface InputFileProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  preview: string;
}

const InputFile: FC<InputFileProps> = ({ onChange, preview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <img
        className={style.img}
        src={preview}
        alt=""
        onClick={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onChange}
        style={{ display: "none" }}
      />
    </>
  );
};

export default InputFile;
