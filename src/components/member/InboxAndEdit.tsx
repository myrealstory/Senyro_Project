"use client";

import { LocaleKeysType } from "@/app/i18n";
import Image from "next/image";
import Mailbox from "@/images/icons/Icon_message-inactive.png";
import MailboxActive from "@/images/icons/Icon_message-active.png";
import Gear from "@/images/icons/Icon_gear-deactivated-black.png";
import GearActivated from "@/images/icons/Icon_gear-activated-gold.png";
import { usePathname } from "next/navigation";
import { useGetInboxUnreadCountQuery } from "@/redux/api/memberApi";
import { ROUTES } from "@/constants";

export const InboxAndEdit = ({ lang }: { lang: LocaleKeysType }) => {
  const path = usePathname();

  const { data: InboxUnreadCount } = useGetInboxUnreadCountQuery();
  const totalMessages = InboxUnreadCount?.data?.unreadCount ?? 0;

  return (
    <div className="profileInboxAndEditContainer">
      <div>
        <a href={`/${lang}/${ROUTES.MEMBER_INBOX}`} className="relative">
          <Image
            src={
              path.includes(`/${lang}/${ROUTES.MEMBER_INBOX}`) ||
              path.includes(`/${lang}/${ROUTES.INBOX_PERSONAL}`) ||
              path.includes(`/${lang}/${ROUTES.INBOX_PROMOTION}`)
                ? MailboxActive
                : Mailbox
            }
            width={0}
            height={0}
            alt="mail inbox"
            className="h-auto w-[25px] lg:w-[30px]"
          />
          <div
            className={`profileTotalMsgs ${
              path.includes(`/${lang}/${ROUTES.MEMBER_INBOX}`) ||
              path.includes(`/${lang}/${ROUTES.INBOX_PERSONAL}`) ||
              path.includes(`/${lang}/${ROUTES.INBOX_PERSONAL}`)
                ? "profileTotalMsgsActivate"
                : "profileTotalMsgsDeactivate"
            }`}
          >
            <span className="profileTotalMsgsText">{totalMessages}</span>
          </div>
        </a>
        <a href={`/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}`}>
          <Image
            src={path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` ? GearActivated : Gear}
            width={0}
            height={0}
            alt="Gear icon"
            className="h-auto w-[24px] lg:w-[30px]"
          />
        </a>
      </div>
    </div>
  );
};
