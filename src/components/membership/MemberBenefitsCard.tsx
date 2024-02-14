import Image from "next/image";
import BasicMember from "@/images/membership/basic-member.png";
import EliteMember from "@/images/membership/Elite.png";
import PrestigeMember from "@/images/membership/Prestige.png";
import BasicTc from "@/images/membership/Basic_TC.png";
import EliteTc from "@/images/membership/Elite_TC.png";
import PrestigeTc from "@/images/membership/Prestige_TC.png";
import "@/style/member/member.scss";
import { LocaleKeysType } from "@/app/i18n";

export const MemberBenefitsCard = ({ lang }: { lang: LocaleKeysType }) => {
  const memberTierList = [
    {
      title: "Basic Member",
      imageEn: (
        <Image
          src={BasicMember}
          width={0}
          height={0}
          className="h-auto w-auto self-center xl:w-fit"
          alt="Basic Member"
        />
      ),
      imageTc: (
        <Image src={BasicTc} width={0} height={0} className="h-auto w-auto self-center xl:w-fit" alt="Basic Member" />
      ),
    },
    {
      title: "Elite Member",
      imageEn: (
        <Image
          src={EliteMember}
          width={0}
          height={0}
          className="h-auto w-auto self-center xl:w-fit"
          alt="Elite Member"
        />
      ),
      imageTc: (
        <Image src={EliteTc} width={0} height={0} className="h-auto w-auto self-center xl:w-fit" alt="Elite Member" />
      ),
    },
    {
      title: "Prestige Member",
      imageEn: (
        <Image
          src={PrestigeMember}
          width={0}
          height={0}
          className="h-auto w-auto self-center xl:w-fit"
          alt="Prestige Member"
        />
      ),
      imageTc: (
        <Image
          src={PrestigeTc}
          width={0}
          height={0}
          className="h-auto w-auto self-center xl:w-fit"
          alt="Prestige Member"
        />
      ),
    },
  ];

  const renderMemberTierImage = (lang: LocaleKeysType) => {
    return memberTierList.map(item => {
      if (lang === "en") {
        return (
          <div key={item.title} className="memberBenefitsCardContainer">
            {item.imageEn}
          </div>
        );
      } else {
        return (
          <div key={item.title} className="memberBenefitsCardContainer">
            {item.imageTc}
          </div>
        );
      }
    });
  };
  return <>{renderMemberTierImage(lang)}</>;
};
