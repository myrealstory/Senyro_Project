import { LocaleKeysType } from "@/app/i18n";
import { CartApiDataType, CartLocalDataType, RefCategoryBasicType } from "./cartTypes";
import { AddToCartButtonType } from "./componentTypes";
import { CategoriesStoreType } from "./categorysTypes";
import { GeneralStateType } from "./generalTypes";

export type UseAddToCartButtonType<T extends "isMainProduct" | "isSubProduct" | "isCartPage"> = {
  source: AddToCartButtonType<T>["source"];
  product?: AddToCartButtonType<T>["product"];
  lang: LocaleKeysType;
  isSetProduct: boolean;
  slugId?: string;
  cartKey?: string;
  cartLocalData: CartLocalDataType;
  cartApiData: CartApiDataType;
  categoriesData: CategoriesStoreType;
  generateState: GeneralStateType;
} & RefCategoryBasicType;

export type UseSetProductPopupType = {
  lang: LocaleKeysType;
  slugId?: string;
};

export type UseCartPickupStepType = {
  lang: LocaleKeysType;
};

export type UseCartType = {
  lang: LocaleKeysType;
};
