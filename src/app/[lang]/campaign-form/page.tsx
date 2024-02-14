import React from "react";
// import { EnquiryForm } from "@/components/campaign/EnquiryForm";
import { LocaleKeysType } from "@/app/i18n";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import { CampaignForm } from "@/components/campaign/CampaignForm";
import Banner from "@/images/samplePic/Food Safety Banner.png";
import Image from "next/image";
import "@/style/campagin/campagin.scss";

const CampaignFormPage = ({ params }: { params: { lang: LocaleKeysType } }) => {
  return (
    <>
      <ScrollToTopBtn />
      <header>
        <Image
          src={Banner}
          width={0}
          height={0}
          alt="Sen-ryo hero banner"
          className="joinCampaginFormBanner "
          loading="lazy"
          placeholder="blur"
        />
      </header>

      <section className="joinCampaginFormSection">
        <h1 className="">Campaign Title</h1>
        <p className="joinCampaginFormP1">
          Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
          tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus.
        </p>
        <ul className="joinCampaginFormSectionUl">
          <li>
            Korem ipsum amet: <span className="font-bold ">2023/03/30 - 2023/04/30</span>
          </li>
          <li>Metus nec fringilla</li>
          <li>Risus sem sollicitudin lacus.</li>
        </ul>

        <div className="joinCampaginFormWhiteBgContainer">
          <div className="joinCampaginFormWhiteBgContentContainer">
            <h3 className="">Join Campaign</h3>
            <p className="joinCampaginFormWhiteBgContentP1">
              Sen-ryo’d like to know more about you, so that we can offer the most suitable promotions to meet your
              needs.
            </p>
            <p className="joinCampaginFormWhiteBgContentP2">
              Should you have any enquiry, <span className="block"> </span>
              please contact us.
            </p>
          </div>
          {/* <EnquiryForm lang={params.lang} /> */}
          <CampaignForm lang={params.lang} />
        </div>
      </section>
    </>
  );
};

export default CampaignFormPage;
