import { FC } from "react";
import style from "./style.module.scss";

interface ModalProps {
  hide: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ children, onClose, hide }) => {
  return (
    <div
      className={style.modalWrapper}
      onClick={(e) => {
        onClose();
      }}
    >
      <div className={style.modalContent}>{children}</div>
    </div>
  );
};

export default Modal;
