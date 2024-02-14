import Image from "next/image";
import Upgrade from "@/images/icons/Icon_upgrade-black.png";
import UpgradeDetailsEN from "@/images/membership/upgrade-renew.png";
import UpgradeDetailsTC from "@/images/membership/Upgrade_Renew_TC.png";
import Privileges from "@/images/icons/Icon_privileges-black.png";
import PrivilegesDetailsEN from "@/images/membership/member-privileges.png";
import PrivilegesDetailsTC from "@/images/membership/Member_Privileges_TC.png";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/member/member.scss";
import { ImageDisplay } from "./ImageDisplay";

type ImageType = "upgrade" | "privileges";

export const MemberUpgradePrivileges = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate: t } = useTranslation(lang);

  const getImageSrc = (lang: LocaleKeysType, type: ImageType) => {
    const images = {
      en: {
        upgrade: UpgradeDetailsEN,
        privileges: PrivilegesDetailsEN,
      },
      tc: {
        upgrade: UpgradeDetailsTC,
        privileges: PrivilegesDetailsTC,
      },
    };

    return images[lang][type];
  };

  const getImageAlt = (lang: LocaleKeysType, type: ImageType) => {
    const alts = {
      en: {
        upgrade: "Spend $300 or above to become basic member",
        privileges: "Membership activated after e-mail verified",
      },
      tc: {
        upgrade: "花費 $300 或更多來成為百兩會員",
        privileges: "會員將會在郵箱驗證後啟用",
      },
    };

    return alts[lang][type];
  };

  return (
    <div className="memberUpgradePrivilegesContainer">
      <div>
        <div id="upgrade_renew" className="memberUpgradePrivilegesTitles">
          <Image src={Upgrade} width={0} height={0} alt="icon" className="" />
          <h2>{t("membershipProgram.upgrade")}</h2>
        </div>
        <ImageDisplay
          imageSrc={getImageSrc(lang, "upgrade")}
          alt={getImageAlt(lang, "upgrade")}
          style="h-auto w-full"
          width={0}
          height={0}
        />
      </div>
      <div>
        <div id="upgrade_renew" className="memberUpgradePrivilegesTitles">
          <Image src={Upgrade} width={0} height={0} alt="icon" className="" />
          <h2>{t("membershipProgram.memberPrivilege")}</h2>
        </div>
        <ImageDisplay
          imageSrc={getImageSrc(lang, "privileges")}
          alt={getImageAlt(lang, "upgrade")}
          style="h-auto w-full"
          width={0}
          height={0}
        />
      </div>
    </div>
  );
};
