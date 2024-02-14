"use client";

import Image from "next/image";

import membershipCard from "@/images/membership/membership-program.png";
import membershipCardTc from "@/images/membership/Membership_banner_TC@2x.png";
import becomeMemberEN from "@/images/membership/Become_member_EN@3x.png";
import becomeMemberTC from "@/images/membership/Become_member_TC@3x.png";
import upgradeEN from "@/images/membership/Ugrade_Renew_EN@3x.png";
import upgradeTC from "@/images/membership/Ugrade_Renew_TC@3x.png";
import privilegesEN from "@/images/membership/Member_Privileges_EN@3x.png";
import privilegesTC from "@/images/membership/Member_Privileges_TC@3x.png";
import termsAndConditionsEN from "@/images/membership/T&C_EN@3x.png";
import termsAndConditionsTC from "@/images/membership/T&C_TC@3x.png";
import detailsEN from "@/images/membership/Details_EN@3x.png";
import detailsTC from "@/images/membership/Details_TC@3x.png";
import { useTranslation } from "@/app/i18n/client";
import { MemberBenefitsCard } from "@/components/membership/MemberBenefitsCard";
import { BecomeMemberCard } from "@/components/membership/BecomeMemberCard";
import { MemberUpgradePrivileges } from "@/components/membership/MemberUpgradePrivileges";
import { FaqsCard } from "@/components/membership/FaqsCard";

import "@/style/member/member.scss";
import { LocaleKeysType } from "@/app/i18n";
import { ROUTES } from "@/constants";
import { ScrollToTopBtn } from "../ScrollToTopBtn";

export default function MembershipProgramPage({ lang }: { lang: LocaleKeysType }) {
  const { translate: t } = useTranslation(lang);

  const Links = [
    {
      id: "becomeMember",
      imageEN: (
        <Image src={becomeMemberEN} width={0} height={0} className="h-auto w-full self-center" alt="Become member" />
      ),
      imageTC: <Image src={becomeMemberTC} width={0} height={0} className="h-auto w-full self-center" alt="成為會員" />,
      anchor: "#become_member",
    },
    {
      id: "becomeMember",
      imageEN: (
        <Image src={upgradeEN} width={0} height={0} className="h-auto w-full self-center" alt="Upgrade and renew" />
      ),
      imageTC: <Image src={upgradeTC} width={0} height={0} className="h-auto w-full self-center" alt="升級以及續會" />,
      anchor: "#upgrade_renew",
    },
    {
      id: "memberPrivilege",
      imageEN: (
        <Image src={privilegesEN} width={0} height={0} className="h-auto w-full self-center" alt="member privileges" />
      ),
      imageTC: <Image src={privilegesTC} width={0} height={0} className="h-auto w-full self-center" alt="會員禮遇" />,
      anchor: "#member_privileges",
    },
    {
      id: "details",
      imageEN: <Image src={detailsEN} width={0} height={0} className="h-auto w-full self-center" alt="Faqs" />,
      imageTC: <Image src={detailsTC} width={0} height={0} className="h-auto w-full self-center" alt="相關問題" />,
      anchor: "#faqs",
    },
    {
      id: "termsAndConditions",
      imageEN: (
        <Image src={termsAndConditionsEN} width={0} height={0} className="h-auto w-full self-center" alt="Faqs" />
      ),
      imageTC: (
        <Image src={termsAndConditionsTC} width={0} height={0} className="h-auto w-full self-center" alt="相關問題" />
      ),
      anchor: `${ROUTES.TERMS_AND_CONDITION}`,
    },
  ];

  const renderLinks = (
    <ul>
      {Links.map(link => (
        <li key={link.id}>
          <a href={link.anchor}>{lang === "en" ? link.imageEN : link.imageTC}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <ScrollToTopBtn />
      <section className="membershipLinksContainer">
        <h1>{t("membershipProgram.membershipProgramText")}</h1>
        <div>
          {lang === "en" ? (
            <Image src={membershipCard} width={0} height={0} alt="Membership program" />
          ) : (
            <Image src={membershipCardTc} width={0} height={0} alt="Membership program" />
          )}
        </div>
        {renderLinks}
      </section>
      <section className="membershipContainer">
        <MemberBenefitsCard lang={lang} />
        <BecomeMemberCard lang={lang} />
        <MemberUpgradePrivileges lang={lang} />
        <FaqsCard lang={lang} />
      </section>
    </>
  );
}
