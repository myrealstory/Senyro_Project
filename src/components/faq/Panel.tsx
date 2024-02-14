import Image from "next/image";
import ChevronOpen from "@/images/icons/Icon_chevron-open-white.png";
import ChevronClose from "@/images/icons/Icon_chevron-close-black.png";
import "@/style/general-information/general-information.scss";
import { useDispatch } from "react-redux";
import { setActiveIndexFaq } from "@/redux/slice/generalStateSlice";

interface PanelProps {
  title: string;
  isActive: boolean;
  activeIndx: number;
  onShow: (index: number) => void;
  listNumber?: number;
  anwser?: string;
}

export const Panel = ({ title, isActive, activeIndx, onShow, listNumber, anwser }: PanelProps) => {
  const dispatch = useDispatch();
  // const activeIndexFaq = useSelector((state: RootState) => state.generalState.activeIndexFaq);
  return (
    <section
      className="FAQPanelContainer"
      role={"button"}
      onClick={!isActive ? () => onShow(activeIndx) : () => dispatch(setActiveIndexFaq(-1))}
    >
      <ol
        start={listNumber}
        className={` ${isActive ? "rounded-t-[10px] bg-primaryGold text-white" : "rounded-[6px] bg-white"}`}
      >
        <li className="">
          <h3 className="">{title}</h3>
        </li>
        {!isActive ? (
          <button className="FAQPanelButton" type="button" aria-expanded="true" onClick={() => onShow(activeIndx)}>
            <Image
              src={ChevronClose}
              width={0}
              height={0}
              alt="Click here to open faq accordion"
              className="h-auto w-[15px]"
            />
          </button>
        ) : (
          <button
            className="FAQPanelButton"
            type="button"
            aria-expanded="true"
            onClick={() => dispatch(setActiveIndexFaq(-1))}
          >
            <Image
              src={ChevronOpen}
              width={0}
              height={0}
              alt="Click here to close faq accordion"
              className="h-auto w-[15px]"
            />
          </button>
        )}
      </ol>

      {isActive && (
        <div>
          <p className="FAQAnswerText">{anwser}</p>
        </div>
      )}
    </section>
  );
};
