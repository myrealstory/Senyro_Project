import Image from "next/image";
import BecomeMember from "@/images/icons/Icon_become_member.png";
import Upgrade from "@/images/icons/Icon_upgrade_renew.png";
import Privileges from "@/images/icons/Icon_member-privileges.png";
import Faqs from "@/images/icons/Icon_faqs.png";
import TermsAndConditions from "@/images/icons/Icon_termsAndConditions.png";

export interface Link {
  title: string;
  image: React.ReactNode;
  anchor: string;
}

export const Links: Link[] = [
  {
    title: "Become member",
    image: (
      <Image
        src={BecomeMember}
        width={24}
        height={24}
        className="h-auto w-[24px] self-center xl:w-fit"
        alt="Become member"
      />
    ),
    anchor: "#become_member",
  },
  {
    title: "Upgrade / Renew",
    image: (
      <Image
        src={Upgrade}
        width={13.82}
        height={13.2}
        className="h-auto w-[24px]  self-center xl:w-fit"
        alt="Upgrade and renew"
      />
    ),
    anchor: "#upgrade_renew",
  },
  {
    title: "Member Privileges",
    image: (
      <Image
        src={Privileges}
        width={12.82}
        height={13.41}
        className="h-auto w-[24px]  self-center xl:w-fit"
        alt="member privileges"
      />
    ),
    anchor: "#member_privileges",
  },
  {
    title: "FAQs",
    image: <Image src={Faqs} width={16} height={15} className="h-auto w-[24px]   self-center xl:w-fit" alt="Faqs" />,
    anchor: "#faqs",
  },
  {
    title: "Terms & Conditions",
    image: (
      <Image
        src={TermsAndConditions}
        width={13.5}
        height={15}
        className="h-auto w-[24px] self-center xl:w-fit"
        alt="Terms and conditions"
      />
    ),
    anchor: "#terms_conditions",
  },
];
