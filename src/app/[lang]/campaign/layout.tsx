// import Banner from "@/images/samplePic/Banner.png";
// import Image from "next/image";
import "@/style/campagin/campagin.scss";

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        {/* <Image
          src={Banner}
          width={0}
          height={0}
          alt="Sen-ryo hero banner"
          className="h-auto w-full object-cover"
          loading="lazy"
          placeholder="blur"
        /> */}
      </header>
      <main className="campaignLayout wrapper">{children}</main>
    </>
  );
}
