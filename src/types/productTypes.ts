import { LocaleKeysType } from "@/app/i18n";
import { CartApiAlertListType } from "./cartTypes";

export type TypeOfProductType = "SINGLE" | "SET" | "ADDON";

export type AddSubProductType = {
  skuCode: string;
  quantity: number;
};

export type ProductPriceType = {
  isListPrice: boolean;
  price: string;
  image: string;
  type: string;
};

export type ProductBadgeIcon = {
  name: string;
  icon: string;
};

export type ProductMandatoryType = {
  oosStatus: boolean;
  skuCode: string;
  type: TypeOfProductType;
  quotaCount: number | null;
};

export type ProductCommonType = {
  nameJp: string;
  isAlcoholProduct: boolean;
  name: string;
  images: string[];
  remark: string;
  detail: null;
  description: string;
  attribute: string;
};

export type FavItemListType = {
  totalItemNo: number;
  favItemList: MainProductType[];
};

export type MainProductType = {
  noOfItemInSet: number | null;
  darkBackground: boolean;
  maxItemTypeInSet: number | null;
  unavailablePickupPeriodMessage: null;
  detailPageMetaTitle: null;
  detailPageMetaDescription: null;
  detailPageMetaKeyword: null;
  subProducts: SubProductType[];
  detailPageSlug: string;
  isFavourite: boolean;
  memberPriceBadges: ProductPriceType[];
  generalPriceBadges: ProductPriceType[];
  badges: ProductBadgeIcon[];
  promotionMessage: null; // TBC -> what is this?
  hasDetailPage: boolean;
  addonCampaignId: number;
} & ProductMandatoryType &
  ProductCommonType;

export type SubProductType = {
  id: number;
  productsId: number;
  subProductsId: number;
  subProduct: ProductMandatoryType & ProductCommonType & { price: string };
};

export type RecommendationType = MainProductType & { addonPrice: string; price: string };

// ---------------------------------------- for api ----------------------------------------
export type ProductPageType = {
  skip: null;
  take: null;
  productListCount: 2;
};

export type GetProductApiInputType = {
  // slugId is for client side rtk
  slugId?: string;
  branch?: string;
  type?: "EFFECTIVE" | "PICKUP";
  lang?: LocaleKeysType;
  date?: string;
  category?: string;
  subcategory?: string;
  popupAlert?: boolean;
};

export type GetProductMetaType = {
  detailPageMetaTitle: string;
  detailPageMetaDescription: string;
  detailPageMetaKeyword: string;
};

export type ProductApiType<T extends "isList" | "isDetail"> = {
  productList: T extends "isList" ? MainProductType[] : never;
  page: T extends "isList" ? ProductPageType : never;
  product: T extends "isDetail" ? MainProductType : never;
  recommendationList: RecommendationType[];
  recommendationId: number;
  alertList?: CartApiAlertListType[];
};
