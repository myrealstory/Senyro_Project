import { Campaign } from "@/types/campaign/campaign";

export const CampaignDescription = ({ campaign }: { campaign: Campaign }) => {
  return (
    <article className="flex w-full flex-col items-center gap-6 text-primaryGold xl:gap-9">
      <h1 className=" text-[22px] font-semibold leading-5 md:text-[24px] xl:text-[40px]">{campaign.title}</h1>
      <p className="text-center text-[14px] leading-5 text-primaryGold4 md:text-[16px]  xl:text-[20px] xl:leading-6">
        {campaign.subtitle}
      </p>
      <ol className="flex flex-col items-center gap-2">
        <li>
          <span className="list-decimal text-[14px] leading-5 md:text-[16px] xl:text-[20px] xl:leading-6">
            ．Korem ipsum amet:{" "}
          </span>
          <span className="block pt-2 text-[14px] font-bold leading-4   md:text-[16px] xl:inline-block xl:text-[20px] xl:leading-6">
            {campaign.startedTime} - {campaign.endedTime}
          </span>
        </li>
        <li>
          <span className="list-decimal text-[14px]  leading-5  md:text-[16px] xl:text-[20px]  xl:leading-6">
            ．{campaign.description1}
          </span>
        </li>
        <li>
          <span className="list-decimal text-[14px]  leading-5  md:text-[16px] xl:text-[20px]  xl:leading-6">
            ．{campaign.description2}
          </span>
        </li>
      </ol>
    </article>
  );
};
