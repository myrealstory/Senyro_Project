"use client";
import React from "react";
import AboutImage from "@/images/samplePic/about_square.png";
import AboutImageBigViewPort from "@/images/samplePic/about_small.png";
import Image from "next/image";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";

const AboutHomeContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <main className="wrapper aboutSenRyoTabMainContainer">
      <ScrollToTopBtn />
      <section>
        <div className="w-full md:w-[50%]">
          <figure>
            <Image
              src={AboutImage}
              width={0}
              height={0}
              className="aboutSenRyoTabImage md:hidden"
              alt="About us, sen-ryo's store/ pic for mobile"
              placeholder="blur"
              loading="lazy"
            />
            <Image
              src={AboutImageBigViewPort}
              width={0}
              height={0}
              className="aboutSenRyoTabImage hidden md:block"
              alt="About us, sen-ryo's store/ pic for desktop"
              placeholder="blur"
              loading="lazy"
            />
          </figure>
        </div>
        <article>
          <h2>{translate("about.aboutus")}</h2>

          <p>{translate("about.content")}</p>
        </article>
      </section>
    </main>
  );
};

export default AboutHomeContainer;
