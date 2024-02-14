"use client";
import { LocaleKeysType } from "@/app/i18n";
import ContactBanner from "@/images/ContactUsBanner.png";
import Image from "next/image";
import { ContactItems } from "./ContactItems";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import { ContactForm } from "@/components/contact/ContactForm";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";

const ContactHomeContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <>
      {/* md:h-[320px] lg:h-auto  2xl:h-[618px] */}
      <div className=" contactPageHeroBanner ">
        <Image
          src={ContactBanner}
          width={0}
          height={0}
          sizes="100vw"
          placeholder="blur"
          loading="lazy"
          // blurDataURL={ContactBanner}
          alt="Contact Banner over md:screen"
          className="contactPageBannerImage "
        />
      </div>
      <main className="contactPageMainContainer wrapper">
        <ScrollToTopBtn />
        <section className="contactPageSection">
          <div className=" contactPageWhiteBgContainer">
            <div className="contactPageContentContainer ">
              <h1 className="">{translate("contactUs.customerFeedback")}</h1>
              <p className="contactPageDesktopSubTitle">{translate("contactUs.descriptionNEW")}</p>
              <p className="contactPageMobileSubTitle">
                {/* Should you have any enquiry, <span className="block"> </span>
              please contact us. */}
                {translate("contactUs.descriptionNEW")}
              </p>
            </div>
            <ContactForm lang={lang} />
          </div>
          <article className="contactPageRightSideParentContainer">
            <ContactItems lang={lang} />
          </article>
        </section>
      </main>
    </>
  );
};

export default ContactHomeContainer;
