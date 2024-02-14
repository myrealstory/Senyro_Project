"use client";
import { getCookie } from "cookies-next";
import "../style/component/component.scss";
// import WechatPay from "@/images/icons/Wechat_Pay.png";
import AppleDownload from "@/images/icons/Icon_AppleDownload@3x.png";
import AndroidDownload from "@/images/icons/Icon_AndroidDownload@3x.png";
import AppleDownloadHover from "@/images/icons/Icon_AppleDownload_Hover.png";
import AndroidDownloadHover from "@/images/icons/Icon_AndroidDownload_Hover.png";
import VISA from "@/images/icons/Icon_VISA@3x.png";
import MasterCard from "@/images/icons/Icon_Master@3x.png";
import AE from "@/images/icons/Icon_AE@3x.png";
import ApplePay from "@/images/icons/Icon_ApplePay@3x.png";
import GooglePay from "@/images/icons/Icon_Google Pay@3x.png";
// import Alipay from "@/images/icons/Icon_AlipayHK@3x.png";
import Octopos from "@/images/icons/Icon_Octopus@3x.png";
import PayMe from "@/images/icons/Icon_PayMe@3x.png";
import HKRMA from "@/images/icons/Icon_HKRMA@3x.png";
import Eshop from "@/images/icons/Icon_EShop@3x.png";
import FBClick from "@/images/icons/Icon_Facebook@3x.png";
import InstagramClick from "@/images/icons/Icon_Instagram@3x.png";
import YoutubeClick from "@/images/icons/Icon_Youtube@3x.png";
import FBClickHover from "@/images/icons/Icon_Facebook_Hover.png";
import InstagramClickHover from "@/images/icons/Icon_Instagram_Hover.png";
import YoutubeClickHover from "@/images/icons/Icon_Youtube_Hover.png";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";
// import shoppingBegIcon from "@/images/icons/Icon_ShoppingBeg.png";
// import locationIcon from "@/images/icons/Icon_MapLocate.png";
// import memberIcon from "@/images/icons/Icon_MemberFooter.png";
import React, { useEffect, useState } from "react";
import { HoverImage } from "./HoverImage";
import CustomSwitch from "./CustomSwitch";
import PressDown from "@/images/icons/Icon_Down_Gold@3x.png";
import PressUp from "@/images/icons/Icon_up@3x.png";
import { DownContentProps, FooterProps } from "@/types/footerTypes";
import { MobileFooter, footerMenu } from "@/constants/footer";
import { usePathname } from "next/navigation";
import { useWindowSize } from "@/hook/useWindowSize";
import { CookiesKey } from "@/constants/cookies";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { useRouter } from "next/navigation";
import { isSafari } from "@/utils/clientUtils";
import { ROUTES } from "@/constants";
import { useGetPromotinoalMsgFooterQuery } from "@/redux/api/generalApi";

// line 165 => 完全不需要footer的頁面

// line 171 => 簡易footer大尺寸用
// (條件:想要的頁面) ? ( 簡易版 desktop footer) : null

// line 227 => 簡易footer小尺寸用
// (條件:想要的頁面) ? ( 簡易版 mobile footer) : null

// line 254 => regular footer
// (條件:不要footer頁面) ? null : (regular footer)
// 因為有些頁面在同一個url link， 會同時有 不同尺寸 不需要footer與要custom footer
export const openLink = (location: string, mode: "_blank" | "_self") => {
  window.open(location, mode);
};

export const DownContentFooter = ({ type, lang }: DownContentProps) => {
  const [switchOn, setSwitchOn] = React.useState(false);
  const { translate } = useTranslation(lang);
  const router = useRouter();

  const handleSwitch = () => {
    setSwitchOn(!switchOn);
  };

  const handleClick = (url: string) => {
    router.push(`/${lang}/${url}`);
  };

  return (
    <>
      {type === "Content" && (
        <div className="mb-2 w-full border-b border-dashed border-secondaryLightGold1">
          <button className=" mb-2 flex w-full  items-center justify-between" onClick={handleSwitch}>
            <p className=" text-[14px] leading-[24px] text-primaryDark">{translate("footer.footerTitle2")}</p>
            <div className=" h-1 w-2">
              <Image
                src={switchOn ? PressUp : PressDown}
                alt="press"
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full"
              />
            </div>
          </button>
          {switchOn && (
            <ul className="flex h-fit w-full flex-wrap">
              {MobileFooter.map((item, index) => (
                <li className="w-1/2" key={index}>
                  <button
                    className="mb-2 py-1 text-[14px] leading-[24px] text-primaryGold hover:text-primaryDark"
                    onClick={() => handleClick(item.link)}
                  >
                    {translate(`footer.${item.name}`)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {type === "Download" && (
        <div className="mb-2 w-full border-b border-dashed border-secondaryLightGold1">
          <button className=" mb-2 flex w-full items-center justify-between" onClick={handleSwitch}>
            <p className=" text-[14px] leading-[24px] text-primaryDark">{translate("footer.downloadApp")}</p>
            <div className=" h-1 w-2" onClick={handleSwitch}>
              <Image
                src={switchOn ? PressUp : PressDown}
                alt="press"
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full"
              />
            </div>
          </button>
          {switchOn && (
            <ul className="flex w-full items-center">
              <li className="mr-5">
                <button className="my-3">
                  <Image src={AppleDownload} height={56} width={168} alt="apple" />
                </button>
              </li>
              <li className="">
                <button className="my-3">
                  <Image src={AndroidDownload} height={56} width={189} alt="android" />
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
      {type === "Regions" && (
        <div className="mb-2 w-full border-b border-dashed border-secondaryLightGold1">
          <button className=" mb-2 flex w-full  items-center justify-between" onClick={handleSwitch}>
            <p className=" text-[14px] leading-[24px] text-primaryDark">{translate("footer.regions")}</p>
            <div className=" h-1 w-2">
              <Image
                src={switchOn ? PressUp : PressDown}
                alt="press"
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full"
              />
            </div>
          </button>
          {switchOn && (
            <ul className="my-3 flex justify-around text-[14px] leading-[24px] text-primaryGold ">
              <li className="hover:text-primaryDark">
                <button
                  className=""
                  onClick={() => {
                    openLink("https://www.genkisushi.co.jp/senryou/", "_blank");
                  }}
                >
                  {translate("footer.jp")}
                </button>
              </li>
              <li className="hover:text-primaryDark">
                <button
                  className=""
                  onClick={() => {
                    openLink("http://www.sen-ryo.com.cn/", "_blank");
                  }}
                >
                  {translate("footer.cn")}
                </button>
              </li>
              <li className="hover:text-primaryDark">
                <button
                  className=""
                  onClick={() => {
                    openLink("https://www.facebook.com/senryosing", "_blank");
                  }}
                >
                  {translate("footer.singapore")}
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export const Footer = ({ lang }: FooterProps) => {
  const isDisplayFooter = getCookie(CookiesKey.isDisplayFooter);
  const { isAppear } = useSelector((state: RootState) => state.height.currentNavHeight);
  const { apiData: cartApiData } = useSelector((state: RootState) => state.cart);
  const path = usePathname();
  const slug = getRouteNameFromPathname(path);
  const { translate } = useTranslation(lang);
  const { width, height } = useWindowSize();
  const [isFooterReady, setIsFooterReady] = useState(false);
  const locationForMoreThanTwoFolder = path.split("/")[3];
  const router = useRouter();
  const [fillHeight, setFillHeight] = useState(0);
  const date = new Date();
  const { data: promotionalMsgFooterData, isSuccess } = useGetPromotinoalMsgFooterQuery({ lang });
  // console.log(promotionalMsgFooterData,"promotionalMsgFooterData")

  useEffect(() => {
    if (width > 768 && width < 1023) {
      setFillHeight((height / ((width / 1023) * 100)) * 8.3);
    } else {
      setFillHeight(0);
    }
  }, [height, width]);
  // need to reform this footer to switch case

  const withoutCheckOut = () => {
    if (slug.thirdSlug === "add-on") {
      return { paddingBottom: "0" };
    } else {
      if ((slug.secondSlug === "cart" || slug.secondSlug === "checkout") && cartApiData?.cart?.itemCount !== 0) {
        return { paddingBottom: "130px" };
      }
      if (isAppear) {
        return { paddingBottom: isSafari() === true ? `${180 + 75}` : "180px" };
      } else {
        return { paddingBottom: isSafari() === true ? `${130 + 75}px` : "130px" };
      }
    }
  };

  useEffect(() => {
    if (width > 0) {
      setIsFooterReady(true);
    }
  }, [width]);

  if (!isDisplayFooter || !isFooterReady) {
    return <></>;
  }

  const handleClick = (url: string) => {
    router.push(`/${lang}/${url}`);
  };

  return (
    <div id="footer" style={{ paddingTop: `${fillHeight}px` }}>
      {/* 簡易footer 大尺寸 */}
      {slug.secondSlug === "checkout" && slug.thirdSlug !== "EDM" && width > 1024 ? (
        <div className=" absolute bottom-0 z-[997] h-auto min-h-[97px] w-full items-center justify-center bg-primaryGrey">
          <div className="relative my-10 flex justify-between lg:mx-auto lg:w-full lg:max-w-[1500px]">
            <div className="flex items-center justify-center text-[12px] leading-[14px] tracking-tight text-primaryDark/40">
              <span>
                {translate("footer.copyRight")}
                {date.getFullYear()}
              </span>
            </div>
            <ul className="flex items-center">
              {/* <li className=" mr-8">
                <button
                  className="text-dark text-lg font-normal hover:text-primaryGold"
                  onClick={() => openLink("/faqs", "_blank")}
                >
                  {translate("footer.faq")}
                </button>
              </li> */}
              <li className=" mr-8">
                <button
                  className="text-10 text-primaryDark hover:text-primaryGold lg:text-12 2xl:text-14"
                  onClick={() => openLink("/terms-conditions", "_blank")}
                >
                  {translate("footer.row1Last")}
                </button>
              </li>
              <li className=" mr-8">
                <button
                  className="text-10 text-primaryDark hover:text-primaryGold lg:text-12 2xl:text-14"
                  onClick={() => openLink("/privacy-policy", "_blank")}
                >
                  {translate("footer.row2Last")}
                </button>
              </li>
              <li>
                <button
                  className="text-10 text-primaryDark hover:text-primaryGold lg:text-12 2xl:text-14"
                  onClick={() => openLink("/membership-terms-and-conditions", "_blank")}
                >
                  {translate("footer.row3Last")}
                </button>
              </li>
            </ul>
            <ul className="flex w-[8.75vw] items-center justify-between">
              <li>
                <button
                  className="h-[2vw] w-[2vw] "
                  onClick={() => openLink("https://www.facebook.com/senryoHongKong", "_blank")}
                >
                  <Image src={FBClick} alt="FBClick" width={0} height={0} sizes="100vw" />
                </button>
              </li>
              <li>
                <button
                  className="h-[2vw] w-[2vw]"
                  onClick={() => openLink("https://www.instagram.com/senryohongkong", "_blank")}
                >
                  <Image src={InstagramClick} alt="InstagramClick" width={0} height={0} sizes="100vw" />
                </button>
              </li>
              <li>
                <button
                  className="h-[2vw] w-[2vw]"
                  onClick={() => openLink("https://www.youtube.com/@sen-ryohongkong7079", "_blank")}
                >
                  <Image src={YoutubeClick} alt="YoutubeClick" width={0} height={0} sizes="100vw" />
                </button>
              </li>
            </ul>
          </div>
          <div className="relative my-10 px-5 lg:hidden">
            <ul className="my-3 flex items-center justify-between  text-sm text-primaryDark">
              <li>
                <button className="hover:text-primaryGold" onClick={() => openLink("/terms-conditions", "_blank")}>
                  {translate("footer.row1Last")}
                </button>
              </li>
              <li>
                <button className="hover:text-primaryGold" onClick={() => openLink("/privacy-policy", "_blank")}>
                  {translate("footer.row2Last")}
                </button>
              </li>
              <li>
                <button
                  className="hover:text-primaryGold"
                  onClick={() => openLink("/membership-terms-and-conditions", "_blank")}
                >
                  {translate("footer.row3Last")}
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      {/* 簡易footer 小尺寸 */}
      {(locationForMoreThanTwoFolder === "payment-in-progress" && width < 768) ||
      (slug.secondSlug === "checkout" && width < 1024) ||
      (slug.secondSlug === "cart" && width < 1024) ||
      (slug.slugWithoutLang === ROUTES.REGISTRATION && locationForMoreThanTwoFolder === "info" && width < 768) ? (
        <>
          <div
            className={
              "absolute bottom-0 z-[997] h-auto min-h-[97px] w-full transform items-center justify-center bg-primaryGrey px-5 duration-200 lg:pb-[130px] "
            }
            id="mobileFooter"
            style={withoutCheckOut()}
            // style={{paddingBottom:"130px"}}
          >
            <div className="mt-6">
              <ul className="my-3 flex items-center justify-between gap-5 text-[12px] leading-[24px] text-primaryDark">
                <li>
                  <button
                    className="underline hover:text-primaryGold"
                    onClick={() => openLink("/terms-conditions", "_blank")}
                  >
                    {translate("footer.row1Last")}
                  </button>
                </li>
                <li>
                  <button
                    className="underline hover:text-primaryGold"
                    onClick={() => openLink("/privacy-policy", "_blank")}
                  >
                    {translate("footer.row2Last")}
                  </button>
                </li>
                <li>
                  <button
                    className="underline hover:text-primaryGold"
                    onClick={() => openLink("/membership-terms-and-conditions", "_blank")}
                  >
                    {translate("footer.row3Last")}
                  </button>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center text-12 leading-[14px] tracking-tight text-primaryDark/40">
              <span>
                {translate("footer.copyRight")}
                {date.getFullYear()}
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          {slug.secondSlug === "maintenance" ||
          slug.secondSlug === "store-location" ||
          slug.secondSlug === "checkout" ||
          (slug.slugWithoutLang === ROUTES.REGISTRATION && width < 1024) ||
          (slug.slugWithoutLang === ROUTES.REGISTRATION && locationForMoreThanTwoFolder === "info" && width < 1024) ||
          (slug.secondSlug === "campaign" && locationForMoreThanTwoFolder === "submitted" && width < 1024) ? (
            <></>
          ) : (
            // regular footer
            <div className="z-[998] w-full bg-primaryGrey pb-24 -tracking-[0.02rem] lg:sticky lg:bottom-0 lg:pb-0">
              <div className="lg:wrapper hidden lg:block lg:pb-12">
                <div className=" w-full justify-between px-4 pt-5 lg:mb-[2.5vw] lg:flex lg:px-0 lg:pt-[2.5vw]">
                  <ul className="  hidden min-w-[260px] text-10 lg:block 2xl:text-14">
                    <li className="mb-5 flex items-center lg:mb-4">
                      {isSuccess && promotionalMsgFooterData?.data?.image?.[0] && (
                        <div className="mr-4 flex aspect-square h-auto w-8 items-center justify-center rounded-full bg-primaryDark p-2 lg:w-10">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${
                              promotionalMsgFooterData?.data?.image?.[0] as string
                            }`}
                            width={0}
                            height={0}
                            alt="watch"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      {isSuccess && promotionalMsgFooterData?.data?.message?.[0] && (
                        <p
                          className=""
                          dangerouslySetInnerHTML={{ __html: promotionalMsgFooterData?.data?.message?.[0] as string }}
                        ></p>
                      )}
                    </li>
                    <li className="mb-5 flex items-center lg:mb-4">
                      {isSuccess && promotionalMsgFooterData?.data?.image?.[1] && (
                        <div className="mr-4 flex aspect-square h-auto w-8 items-center justify-center  rounded-full bg-primaryDark p-2 lg:w-10">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${
                              promotionalMsgFooterData?.data?.image?.[1] as string
                            }`}
                            width={0}
                            height={0}
                            alt="watch"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      {isSuccess && promotionalMsgFooterData?.data?.message?.[1] && (
                        <p
                          className=""
                          dangerouslySetInnerHTML={{ __html: promotionalMsgFooterData?.data?.message?.[1] as string }}
                        ></p>
                      )}
                    </li>
                    <li className="flex items-center">
                      {isSuccess && promotionalMsgFooterData?.data?.image?.[2] && (
                        <div className="mr-4 flex aspect-square h-auto w-8 items-center justify-center rounded-full bg-primaryDark p-2 lg:w-10">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${
                              promotionalMsgFooterData?.data?.image?.[2] as string
                            }`}
                            width={0}
                            height={0}
                            alt="watch"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      {isSuccess && promotionalMsgFooterData?.data?.message?.[2] && (
                        <p
                          className=""
                          dangerouslySetInnerHTML={{ __html: promotionalMsgFooterData?.data.message[2] as string }}
                        ></p>
                      )}
                    </li>
                  </ul>

                  <ul className="hidden h-full w-full lg:block lg:max-w-[350px] xl:max-w-[450px]">
                    <p className="  mb-[10px] text-14 font-semibold leading-5 tracking-[0] lg:mb-3 lg:text-16">
                      {translate("footer.footerTitle2")}
                    </p>
                    <div className="flex h-full w-full justify-between">
                      {footerMenu.map((menu, index) => (
                        <li key={index} className=" [&>:last-child]:mb-0">
                          {menu.map((item, index) => (
                            <button key={index} className="footerMenuBTN" onClick={() => handleClick(item.link)}>
                              {translate(`footer.${item.name}`)}
                            </button>
                          ))}
                        </li>
                      ))}
                    </div>
                  </ul>
                  <ul className="block lg:hidden">
                    <li>
                      <p className="text-dark mb-4 text-center text-base font-medium">{translate("footer.accept")}</p>
                      <div className="flex items-center justify-center">
                        <Image src={VISA} alt="Visa" className="mr-4 h-[0.8vw] w-[2.5vw]" />
                        <Image src={MasterCard} alt="mastercard" className=" mr-4 h-[1vw] w-[1.76vw]" />
                        <Image src={AE} alt="AE" className=" mr-4 h-[1.14vw] w-[0.9vw]" />
                        <Image src={ApplePay} alt="ApplePay" className="w-[1.66vw]" />
                      </div>
                      <div className="mt-4 flex items-center justify-center">
                        <Image src={GooglePay} alt="Visa" className="mr-4 w-[41px]" />
                        {/* <Image src={Alipay} alt="Visa" className="mr-4 w-[91px]" /> */}
                        <Image src={Octopos} alt="Visa" className="w-[39px]" />
                      </div>
                      <div className="mt-4 flex items-center justify-center">
                        <Image src={PayMe} alt="Visa" className="mr-4 w-[57px]" />
                        <Image src={HKRMA} alt="Visa" className="mr-4 w-[58px]" />
                        <Image src={Eshop} alt="Visa" className="w-[58px]" />
                      </div>
                    </li>
                    <li className="my-8 flex items-center justify-center">
                      <button
                        className="mr-4 w-[36px]"
                        onClick={() => openLink("https://www.facebook.com/senryoHongKong", "_blank")}
                      >
                        <Image src={FBClick} alt="Facebook" />
                      </button>
                      <button
                        className="mr-4 w-[36px]"
                        onClick={() => openLink("https://www.instagram.com/senryohongkong", "_blank")}
                      >
                        <Image src={InstagramClick} alt="Instagram" />
                      </button>
                      <button
                        className="w-[36px]"
                        onClick={() => openLink("https://www.youtube.com/@sen-ryohongkong7079", "_blank")}
                      >
                        <Image src={YoutubeClick} alt="youtube Channel" />
                      </button>
                    </li>
                  </ul>
                  <ul className="w-full min-w-[150px] px-4 lg:w-[23%] lg:px-0">
                    <li className="text-dark mb-[10px] text-14 font-semibold leading-5 tracking-[0] lg:mb-3 lg:text-16 2xl:mb-5">
                      {translate("footer.downloadApp")}
                    </li>
                    <li className="flex lg:hidden">
                      <button className=" mb-4 mr-3 h-[32.51px] w-[100px] lg:mr-0">
                        <Image alt="download" src={AppleDownload} height={56} width={168} sizes="100vw" className="" />
                      </button>
                      <button className="h-[32.51px] w-[114px]">
                        <Image
                          alt="download"
                          src={AndroidDownload}
                          height={56}
                          width={189}
                          sizes="100vw"
                          className=""
                        />
                      </button>
                    </li>
                    <div className="hidden items-start lg:flex ">
                      <div className=" -mt-[5px] mr-4 h-14 w-auto" suppressHydrationWarning>
                        <HoverImage
                          defaultSrc={AppleDownload}
                          hoverSrc={AppleDownloadHover}
                          alt="footerDownloadAppStore"
                          hasDetailSlug={true}
                          height={56}
                          width={168}
                          disableAspectSquare={true}
                        />
                      </div>
                      <div className="-mt-[5px] h-14 w-auto" suppressHydrationWarning>
                        <HoverImage
                          defaultSrc={AndroidDownload}
                          hoverSrc={AndroidDownloadHover}
                          alt="footerDownloadGooglePlay"
                          hasDetailSlug={true}
                          height={56}
                          width={189}
                          disableAspectSquare={true}
                        />
                      </div>
                    </div>
                  </ul>
                  <ul className="flex justify-between px-4 pb-12 lg:hidden">
                    <li>
                      <button
                        className="text-dark text-12"
                        onClick={() => {
                          openLink("https://www.genkisushi.co.jp/senryou/", "_blank");
                        }}
                      >
                        {translate("footer.jp")}
                      </button>
                    </li>
                    <li>
                      <button
                        className="text-dark text-12"
                        onClick={() => {
                          openLink("http://www.sen-ryo.com.cn/", "_blank");
                        }}
                      >
                        {translate("footer.cn")}
                      </button>
                    </li>
                    <li>
                      <button
                        className="text-dark text-12"
                        onClick={() => {
                          openLink("https://www.facebook.com/senryosing", "_blank");
                        }}
                      >
                        {translate("footer.singapore")}
                      </button>
                    </li>
                  </ul>
                  <ul className="relative flex items-center justify-between px-4 pb-44 lg:hidden">
                    <li className="tracking-tight">
                      <span className=" text-dark text-sm ">
                        {translate("footer.copyRight")}
                        {date.getFullYear()}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className=" hidden w-full border-b border-solid border-black lg:block">
                  <div className="my-0 mb-16 flex h-full max-h-[48px] items-center justify-between">
                    <Image src={VISA} alt="Visa" className="aspect-[3/1] h-[36px] w-auto" />
                    <Image src={MasterCard} alt="MasterCard" className="aspect-[1.6/1] h-[48px] w-auto" />
                    <Image src={AE} alt="AE" className="aspect-square h-[48px] w-auto" />
                    <Image src={ApplePay} alt="ApplePay" className="aspect-[1.5/1] h-[48px] w-auto " />
                    <Image src={GooglePay} alt="GooglePay" className="aspect-[1.875/1] h-[48px] w-auto" />
                    {/* <Image src={WechatPay} alt="WechatPay" className="w-[8vw]" /> */}
                    {/* <Image src={Alipay} alt="Alipay" className="w-[9.3vw]" /> */}
                    <Image src={Octopos} alt="Octopos" className="aspect-[2.5/1] h-[46px] w-auto" />
                    <Image src={PayMe} alt="PayMe" className="aspect-[2.5/1] h-[46px] w-auto" />
                    <Image src={HKRMA} alt="HKRMA" className="aspect-[2.4/1] h-[48px] w-auto " />
                    <Image src={Eshop} alt="Eshop" className="aspect-[2.4/1] h-[48px] w-auto" />
                  </div>
                </div>
                <div className="relative mt-10 hidden w-full justify-between lg:flex">
                  <div className="flex items-center opacity-40">
                    <span className=" text-dark text-12 ">
                      {translate("footer.copyRight")}
                      {date.getFullYear()}
                    </span>
                  </div>
                  <ul className="flex items-center ">
                    <li className=" mr-8">
                      <button
                        className="text-10 text-primaryDark hover:text-primaryGold lg:text-12 2xl:text-14"
                        onClick={() => {
                          openLink("https://www.genkisushi.co.jp/senryou/", "_blank");
                        }}
                      >
                        {translate("footer.jp")}
                      </button>
                    </li>
                    <li className=" mr-8">
                      <button
                        className="text-10 text-primaryDark hover:text-primaryGold lg:text-12 2xl:text-14"
                        onClick={() => {
                          openLink("http://www.sen-ryo.com.cn/", "_blank");
                        }}
                      >
                        {translate("footer.cn")}
                      </button>
                    </li>
                    <li>
                      <button
                        className="text-10 text-primaryDark hover:text-primaryGold lg:text-12 2xl:text-14"
                        onClick={() => {
                          openLink("https://www.facebook.com/senryosing", "_blank");
                        }}
                      >
                        {translate("footer.singapore")}
                      </button>
                    </li>
                  </ul>
                  <ul className="flex max-h-[40px] w-[12%] items-center justify-between">
                    <li
                      className=" h-auto w-[25%] "
                      role={"button"}
                      onClick={() => openLink("https://www.facebook.com/senryoHongKong", "_blank")}
                    >
                      <HoverImage
                        defaultSrc={FBClick}
                        hoverSrc={FBClickHover}
                        alt="FBClick"
                        hasDetailSlug={true}
                        classname=" aspect-square "
                      />
                    </li>
                    <li
                      className="h-auto w-[25%]"
                      role={"button"}
                      onClick={() => openLink("https://www.instagram.com/senryohongkong", "_blank")}
                    >
                      <HoverImage
                        defaultSrc={InstagramClick}
                        hoverSrc={InstagramClickHover}
                        alt="InstagramClick"
                        hasDetailSlug={true}
                        classname=" aspect-square"
                      />
                    </li>
                    <li
                      className="h-auto w-[25%]"
                      role={"button"}
                      onClick={() => openLink("https://www.youtube.com/@sen-ryohongkong7079", "_blank")}
                    >
                      <HoverImage
                        defaultSrc={YoutubeClick}
                        hoverSrc={YoutubeClickHover}
                        alt="YoutubeClick"
                        hasDetailSlug={true}
                        classname=" aspect-square"
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div className={` block px-5 ${slug.secondSlug === "index" ? "pb-0" : "pb-28"} pt-7 lg:hidden`}>
                <div className="mb-10 flex w-full justify-between px-3">
                  <div className="w-20">
                    {isSuccess && promotionalMsgFooterData?.data?.image?.[0] && (
                      <div className="mx-auto mb-2 w-10 rounded-full bg-primaryDark p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${
                            promotionalMsgFooterData?.data?.image?.[0] as string
                          }`}
                          alt="watchIcon"
                          width={0}
                          height={0}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className=" whitespace-normal text-center text-[12px] leading-[14px] ">
                      {
                        isSuccess && promotionalMsgFooterData?.data?.message?.[0] && (
                          <p
                            className=""
                            dangerouslySetInnerHTML={{ __html: promotionalMsgFooterData?.data?.message?.[0] as string }}
                          ></p>
                        )
                        // : (
                        //   <>
                        //   <span className="  text-primaryDark">{translate("footer.watch1")}</span>
                        //   <span className="  font-semibold text-primaryGold">{translate("footer.watch2")}</span>
                        //   <span className="  text-primaryDark">{translate("footer.watch3")}</span>
                        //   </>
                        // )
                      }
                    </div>
                  </div>
                  <div className="w-20">
                    {isSuccess && promotionalMsgFooterData?.data?.image?.[1] && (
                      <div className="mx-auto mb-2 w-10 rounded-full bg-primaryDark p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${
                            promotionalMsgFooterData?.data?.image?.[1] as string
                          }`}
                          alt="TargetIcon"
                          width={0}
                          height={0}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className=" whitespace-normal text-center text-[12px] leading-[14px] text-primaryDark ">
                      {
                        isSuccess && promotionalMsgFooterData?.data?.message?.[1] && (
                          <p
                            className=""
                            dangerouslySetInnerHTML={{ __html: promotionalMsgFooterData?.data?.message?.[1] as string }}
                          ></p>
                        )
                        // :
                        // <>
                        // <span className=" text-primaryGold">{translate("footer.target1")}</span>
                        // <span className="font-semibold text-primaryDark">{translate("footer.target2")}</span>
                        // <span>&nbsp;</span>
                        // <span className={`${lang === "en" ? "font-semibold" : ""}   text-primaryDark`}>
                        //   {translate("footer.target3")}
                        // </span>
                        // </>
                      }
                    </div>
                  </div>
                  <div className="w-20">
                    {isSuccess && promotionalMsgFooterData?.data?.image?.[2] && (
                      <div className="mx-auto mb-2 w-10 rounded-full bg-primaryDark p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${
                            promotionalMsgFooterData?.data?.image?.[2] as string
                          }`}
                          alt="GiftIcon"
                          width={0}
                          height={0}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className=" whitespace-normal text-center text-[12px] leading-[14px] ">
                      {isSuccess && promotionalMsgFooterData?.data?.message?.[2] && (
                        <p
                          className=""
                          dangerouslySetInnerHTML={{ __html: promotionalMsgFooterData?.data?.message?.[2] as string }}
                        ></p>
                      )}
                      {/* <span className=" text-primaryDark">{translate("footer.gift1")}</span>
                      <span>&nbsp;</span>
                      <span className=" font-semibold text-primaryGold">{translate("footer.gift2")}</span>
                      <span>&nbsp;</span>
                      <span className=" text-primaryDark">{translate("footer.gift3")}</span> */}
                    </div>
                  </div>
                </div>
                <div className="mb-6 flex justify-between">
                  <CustomSwitch type={"language"} />
                  <ul className="flex w-[8rem] items-center justify-between">
                    <li>
                      <button
                        className=" h-[28px] w-[28px]"
                        onClick={() => openLink("https://www.facebook.com/senryoHongKong", "_blank")}
                      >
                        <Image src={FBClick} alt="FBClick" width={0} height={0} sizes="100vw" />
                      </button>
                    </li>
                    <li>
                      <button
                        className=" h-[28px] w-[28px]"
                        onClick={() => openLink("https://www.instagram.com/senryohongkong", "_blank")}
                      >
                        <Image src={InstagramClick} alt="FBClick" width={0} height={0} sizes="100vw" />
                      </button>
                    </li>
                    <li>
                      <button
                        className=" h-[28px] w-[28px]"
                        onClick={() => openLink("https://www.youtube.com/@sen-ryohongkong7079", "_blank")}
                      >
                        <Image src={YoutubeClick} alt="FBClick" width={0} height={0} sizes="100vw" />
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <DownContentFooter type={"Content"} lang={lang} />
                  <DownContentFooter type={"Download"} lang={lang} />
                  <DownContentFooter type={"Regions"} lang={lang} />
                </div>
                <div className="w-full border-b border-solid border-primaryDark py-5">
                  <div className="mx-auto w-[80%] sm:w-[50%] lg:w-[65%]">
                    <div className="flex w-full items-center justify-center">
                      <Image src={VISA} alt="Visa" width={0} height={0} sizes="100vw" className=" my-2 mr-2 h-4 w-12" />
                      <Image
                        src={MasterCard}
                        alt="MasterCard"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="mx-2 my-2 h-5 w-auto"
                      />
                      <Image src={AE} alt="Visa" width={0} height={0} sizes="100vw" className=" mx-2 my-2 h-5 w-auto" />
                      <Image
                        src={ApplePay}
                        alt="ApplePay"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" mx-2 my-2 h-5 w-auto"
                      />
                      <Image
                        src={GooglePay}
                        alt="GooglePay"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" my-2 ml-2 h-5 w-auto"
                      />
                    </div>
                    <div className="flex w-full items-center justify-center">
                      <Image
                        src={PayMe}
                        alt="PayMe"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" mx-2 my-2 h-6 w-auto"
                      />
                      <Image
                        src={Octopos}
                        alt="Octopos"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" mx-2 my-2 h-6 w-auto"
                      />
                      {/* <Image
                        src={Alipay}
                        alt="Visa"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" my-2 ml-2 h-5 w-auto"
                      />
                      <Image
                        src={WechatPay}
                        alt="WechatPay"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" my-2 ml-2 h-5 w-auto"
                      /> */}
                    </div>
                    <div className="flex w-full items-center justify-center">
                      <Image
                        src={HKRMA}
                        alt="HKRMA"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" mx-2 my-2 h-7 w-auto"
                      />
                      <Image
                        src={Eshop}
                        alt="Eshop"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" mx-2 my-2 h-7 w-auto"
                      />
                    </div>
                  </div>
                </div>
                <ul className="my-3 flex items-center justify-between text-[12px] leading-[24px] text-primaryDark">
                  <li>
                    <button
                      className="underline hover:text-primaryGold"
                      onClick={() => router.push(`/${lang}/terms-conditions`)}
                    >
                      {translate("footer.row1Last")}
                    </button>
                  </li>
                  <li>
                    <button
                      className="underline hover:text-primaryGold"
                      onClick={() => router.push(`/${lang}/privacy-policy`)}
                    >
                      {translate("footer.row2Last")}
                    </button>
                  </li>
                  <li>
                    <button
                      className="underline hover:text-primaryGold"
                      onClick={() => router.push(`/${lang}/membership-terms-and-conditions`)}
                    >
                      {translate("footer.row3Last")}
                    </button>
                  </li>
                </ul>
                <div className="flex items-center justify-center text-[12px] leading-[14px] text-primaryDark opacity-40">
                  <span className="">
                    {" "}
                    {translate("footer.copyRight")}
                    {date.getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
