"use client";
import Banner from "@/images/WEB-IMAGE-ingredients.png";
import Image from "next/image";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import PromoSquare from "@/images/Promo Banner.png";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";

const QualityIngredientContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <>
      <header>
        <Image
          src={Banner}
          width={0}
          height={0}
          alt="Sen-ryo hero banner"
          className="aboutPageHeroBanner"
          loading="lazy"
          placeholder="blur"
        />
      </header>
      <main className="wrapper qualityIngredientMainContainer">
        <h1 className="pb-6 text-center text-[24px] font-semibold leading-5 text-primaryGold lg:pb-9 lg:text-[32px] lg:leading-10 xl:text-[40px] xl:leading-[51px] ">
          {translate("ingredient.title")}
        </h1>
        <p className="qualityIngredientFirstP">{translate("ingredient.titleContent")}</p>
        <section className="">
          <ScrollToTopBtn />

          {/* first picture with text */}
          <div className="qualityIngredientParentDiv">
            <div className="qualityIngredientImageDiv ">
              <Image src={PromoSquare} alt="promotion" className="qualityIngredientImage" />
            </div>
            <article className=" ">
              <h2 className="">{translate("ingredient.firstH2")}</h2>
              <h3 className=" ">{translate("ingredient.firstH3")}</h3>
              <p className="">{translate("ingredient.firstP")}</p>
            </article>
          </div>

          {/* second picture with text */}
          <div className="qualityIngredientParentDiv">
            <div className="qualityIngredientImageDiv ">
              <Image src={PromoSquare} alt="promotion" className="qualityIngredientImage" />
            </div>
            <article className=" ">
              <h2 className="2xl:-mt-2">{translate("ingredient.secondH2")}</h2>
              <h3 className="">{translate("ingredient.secondH3")}</h3>
              <p className="">{translate("ingredient.secondP")}</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

export default QualityIngredientContainer;
