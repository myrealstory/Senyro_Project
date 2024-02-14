import { DiscountTagProps } from "@/types/index/indexType";

export const DiscountTag = ({ style, price, discount, noLine }: DiscountTagProps) => {
  const newPrice = Number(price);
  const discountPrice = discount > 0 && discount < 100 ? newPrice - newPrice * (discount / 100) : price;

  return (
    <span
      className={`${style} ${discount > 0 && discount < 100 ? "discount-tag" : ""} ${
        noLine ? "" : "after:bg-primaryGold"
      }`}
    >
      {`$${discountPrice}`}
    </span>
  );
};
