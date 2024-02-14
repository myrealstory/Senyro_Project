"use client";

import Submitted from "@/images/icons/Icon_submitted.png";
import Image from "next/image";
import Link from "next/link";
import { LocaleKeysType } from "@/app/i18n";
import { ContactItems } from "@/components/contact/ContactItems";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import ContactBanner from "@/images/ContactUsBanner.png";
import { useTranslation } from "@/app/i18n/client";

const ContactSubmittedContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <main className="mx-auto flex w-full flex-col gap-10 ">
      <div className="contactPageHeroBanner">
        <Image
          src={ContactBanner}
          width={0}
          height={0}
          sizes="100vw"
          placeholder="blur"
          loading="lazy"
          // blurDataURL={ContactBanner}
          alt="Contact Banner over md:screen"
          className="h-full w-full object-cover "
        />
      </div>
      <section className="wrapper mb-20 flex flex-col items-center justify-center lg:flex-row  lg:items-start lg:gap-[4rem] 2xl:gap-[6rem]">
        <div className=" my-16 flex w-full flex-col items-center justify-center gap-[24px] lg:my-0 lg:flex lg:h-[400px] lg:w-[457.676px] lg:rounded-[20px] lg:bg-white lg:p-8 lg:shadow-lg 2xl:h-[550px] 2xl:w-[630px] ">
          <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-primaryGold2 xl:mb-[15px] 2xl:h-[120px] 2xl:w-[120px]">
            <Image
              src={Submitted}
              width={0}
              height={0}
              alt="You have submitted successfully"
              className="h-[40px] w-[40px] self-center 2xl:h-[60px] 2xl:w-[60px]"
            />
          </div>
          <article className="flex w-full flex-col items-center justify-center gap-[24px]">
            <h1 className="text-center text-[24px] font-semibold leading-5 text-primaryGold 2xl:text-[34px] 2xl:leading-10 2xl:tracking-[-0.96px]">
              {translate("campaignSubmitted.successfulSubmitted")}
            </h1>
            <p className="w-[70%] text-center text-[14px] leading-6 2xl:w-[75%] 2xl:text-[20px] 2xl:leading-8 2xl:tracking-[-0.56px]">
              {translate("campaignSubmitted.content")}
              <span className={`${lang === "tc" ? "block" : "hidden"}`}></span>{" "}
              {translate("campaignSubmitted.content2")}
            </p>
          </article>
          <div className="md:hidden">
            <MobileButtonContainer>
              <Link
                href={`/${lang}/index`}
                className="mx-auto flex h-[56px] w-full items-center justify-center rounded-full bg-primaryGold py-3 text-[18px] font-medium
                        tracking-[-0.36px] text-white md:w-[25vw] md:min-w-[300px] lg:py-4 2xl:h-[80px]
                        2xl:w-[27vw] 2xl:text-[32px] 2xl:tracking-[-0.64px]"
              >
                {translate("campaignSubmitted.backToHome")}
              </Link>
            </MobileButtonContainer>
          </div>
          <Link
            href={`/${lang}/index`}
            className="mx-auto hidden h-[56px] w-full items-center justify-center rounded-full bg-primaryGold py-3 text-[18px] font-medium tracking-[-0.36px]
                        text-white md:flex md:w-[25vw] md:min-w-[300px] lg:py-4 2xl:h-[80px]
                        2xl:w-[27vw] 2xl:text-[26px] 2xl:tracking-[-0.64px]"
          >
            {translate("campaignSubmitted.backToHome")}
          </Link>
        </div>
        <div className="hidden w-[40%] lg:flex">
          <ContactItems lang={lang} />
        </div>
      </section>
    </main>
  );
};

export default ContactSubmittedContainer;
