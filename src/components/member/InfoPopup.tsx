import { WarningPopupProps } from "@/types/modal/modal";
import Mask from "../Mask";

export const InfoPopup: React.FC<WarningPopupProps> = ({ content, btnText1, btnText2, shown, close, confirm }) => {
  return shown ? (
    <Mask>
      <div className="infoPopupContainer">
        <span>{content}</span>
        <div className="infoPopupBtnsContainer">
          <button
            onClick={close}
            className={`infoPopupText1Btn first-letter
            ${btnText2 ? "w-[50%] border-primaryPurple text-primaryPurple" : "w-full bg-primaryPurple text-white"}`}
          >
            {btnText1}
          </button>
          {btnText2 && (
            <button onClick={confirm} className="infoPopupText2Btn">
              {btnText2}
            </button>
          )}
        </div>
      </div>
    </Mask>
  ) : null;
};
