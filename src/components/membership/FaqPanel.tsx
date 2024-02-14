import Chevron from "@/images/icons/Icon_chevron-close-black.png";
import Image from "next/image";
import "@/style/member/member.scss";

interface Props {
  title: string;
  isActive: boolean;
  activeIndex: number;
  onShow: (index: number) => void;
  children: React.ReactNode;
}

export const FaqPanel = ({ title, isActive, activeIndex, onShow, children }: Props) => {
  return (
    <article className="membershipFaqPanelContainer">
      <ul>
        <li>
          <h3>{title}</h3>
        </li>
        {isActive === true ? (
          <button>
            <Image
              src={Chevron}
              width={0}
              height={0}
              alt="Click here to open faq accordion"
              className="membershipFaqPanelImgAnimation"
            />
          </button>
        ) : (
          <button className="font-semibold" type="button" aria-expanded="true" onClick={() => onShow(activeIndex)}>
            <Image
              src={Chevron}
              width={0}
              height={0}
              alt="Click here to close faq accordion"
              className="h-auto w-[15px]"
            />
          </button>
        )}
      </ul>
      {isActive && <div className="membershipFaqPanelContent">{children}</div>}
    </article>
  );
};
