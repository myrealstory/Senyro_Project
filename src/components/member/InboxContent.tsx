import Image from "next/image";
import "@/style/member/member.scss";
import { SinglePersonalMessageType } from "@/types/api/apiTypes";
import { formattedISODateTime } from "../forms/FormattedUtils";
import { useWindowSize } from "@/hook/useWindowSize";
import { useMemo } from "react";

interface InboxProps {
  message: SinglePersonalMessageType;
  lang: string;
  id: string;
}

export const InboxContent = ({ message, id }: InboxProps) => {
  const formattedDate = formattedISODateTime(message.data.date);
  const { width } = useWindowSize();

  const imageSource = useMemo(() => {
    if (width < 768 && message?.data?.imageUrl?.length) {
      return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${message?.data?.imageUrl}`;
    } else if (width >= 768 && message?.data?.imageHdUrl?.length) {
      return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${message?.data?.imageHdUrl}`;
    }
    return "";
  }, [width, message]);

  return (
    <div className="inboxPromotionMsgContentContainer">
      <article className="w-full">
        <div className="inboxPromotionMsgImageContainer">
          <Image src={imageSource} width={719} height={294} alt="image" />
        </div>

        {message.statusCode === 200 ? (
          <div className="inboxPromotionMsgInfoContainer" key={id}>
            <div className="inboxPromotionMsgInfoSecondContainer">
              <div className="text-right">
                <span className="inboxPromotionMsgDate">{formattedDate}</span>
              </div>
              <div className="inboxPromotionMsgTitlesContainer">
                <h1 className="">{message.data.title}</h1>
                <h2 className="">{message.data.subTitle}</h2>
              </div>
            </div>
            <div className="inboxPromotionMsgContent" dangerouslySetInnerHTML={{ __html: message.data.content }} />
          </div>
        ) : null}
      </article>
    </div>
  );
};
