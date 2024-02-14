import Image from "next/image";
import Senryo from "@/images/icons/Icon_senryo-black.png";
import BecomeMemberEN from "@/images/membership/become-member.png";
import ActivatedMemberEN from "@/images/membership/activated-email.png";
import BecomeMemberTC from "images/membership/Become_Member_01_TC.png";
import ActivatedMemberTC from "images/membership/Become_Member_02_TC.png";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/member/member.scss";
import { ImageDisplay } from "./ImageDisplay";

type ImageType = "becomeMember" | "activatedMember";

export const BecomeMemberCard = ({ lang }: { lang: LocaleKeysType }) => {
  const getImageSrc = (lang: LocaleKeysType, type: ImageType) => {
    const images = {
      en: {
        becomeMember: BecomeMemberEN,
        activatedMember: ActivatedMemberEN,
      },
      tc: {
        becomeMember: BecomeMemberTC,
        activatedMember: ActivatedMemberTC,
      },
    };

    return images[lang][type];
  };

  const getImageAlt = (lang: LocaleKeysType, type: ImageType) => {
    const alts = {
      en: {
        becomeMember: "Spend $300 or above to become basic member",
        activatedMember: "Membership activated after e-mail verified",
      },
      tc: {
        becomeMember: "花費 $300 或更多來成為百兩會員",
        activatedMember: "會員將會在郵箱驗證後啟用",
      },
    };

    return alts[lang][type];
  };

  const { translate: t } = useTranslation(lang);
  return (
    <div>
      <div id="become_member" className="becomeMemberCardContainer">
        <Image src={Senryo} width={0} height={0} alt="icon" />
        <h2>{t("membershipProgram.howToBecomeMember")}</h2>
      </div>
      <div className="flex flex-col gap-5">
        <ImageDisplay
          imageSrc={getImageSrc(lang, "becomeMember")}
          alt={getImageAlt(lang, "becomeMember")}
          style="h-auto w-full"
          width={0}
          height={0}
        />
        <ImageDisplay
          imageSrc={getImageSrc(lang, "activatedMember")}
          alt={getImageAlt(lang, "activatedMember")}
          style="h-auto w-full"
          width={0}
          height={0}
        />
      </div>
    </div>
  );
};
