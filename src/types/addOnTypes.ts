import { MainProductType } from "./productTypes";

export type AddOnListType = {
  promotionMessage: string;
  addonProducts: (MainProductType & { addonPrice: string, price: string })[];
}
