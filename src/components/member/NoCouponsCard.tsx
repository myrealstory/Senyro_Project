import Image from "next/image";
import CouponIcon from "@/images/icons/Icon_coupon-new-gold.png";
import "@/style/member/member.scss";

// import { ActiveCouponsType } from "@/types/api/apiTypes";
// build error
interface Props {
  text: string;
}

export const NoCouponsCard = ({ text }: Props) => {
  return (
    <>
      <div className="noCouponsContainer">
        <Image src={CouponIcon} width={0} height={0} alt="You don't have any coupons" />
        <span>{text}</span>
      </div>
    </>
  );
};
