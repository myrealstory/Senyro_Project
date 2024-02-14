import { PAYMENT_METHOD } from "@/constants/checkout/payment";
import { PickUpMethodType } from "./firstTimeOrderPopupTypes";
import { RecommendationType, TypeOfProductType } from "./productTypes";

export type CartTableModeType = "PRODUCT" | "GIFT";

export type CartBranchType = {
  branchCode: string;
  name: string;
  address: string;
  isAvailable: boolean;
  district: {
    id: number;
    name: string;
  };
  region: any; // api issue
  prepTime?: number;
};

export type ModifiersType = {
  modifierName: string;
  isSelected: boolean;
  skuCode: string;
};

export type CartSubItemType = {
  status: "AVAILABLE";
  skuCode: string;
  quantity: number;
  item: {
    name: string;
    quotaCount: number;
  };
};

export type CartItemType = {
  skuCode: string;
  cartKey: string;
  quantity: number;
  isAllowDelete: boolean;
  item: {
    skuCode: string;
    type: TypeOfProductType;
    nameJp: string;
    isAlcoholProduct: boolean; // issue -> how to use?
    hasDetailPage: boolean;
    detailPageSlug: string | null;
    price: number;
    name: string;
    images: string[];
    quotaCount: number;
    remark: string;
  };
  cpeMessage?: string[];
  subItems?: CartSubItemType[];
  unitPrice?: string;
  subTotalPrice: string;
  discountSubTotalPrice?: string;
};

export type CartLocalDataType = {
  giftProductData?: ProductDataInLocalCartType[] | [];
  singlaProductData?: ProductDataInLocalCartType[] | [];
  setProductData?: SetProductDataInLocalCartType[] | [];
  setProductPopupData: SetProductDataInLocalCartType;
  // general state
  quotaAlertSkuCode?: string;
} & RefCategoryBasicType;

export type CartType = {
  apiData: CartApiDataType;
  localData: CartLocalDataType;
};

export type CartApiResultType = "FAILED" | "FAILED_SET_ITEM_POPUP" | "SUCCESS" | "CART_EXPIRED" |"CART_LOCKED" | "MISSING_BRANCH" | "CACHE_ERROR" 
// below is for FE only
| "PENDING" | "OPEN_SET_PRODUCT_POPUP";

export type CartApiAlertItemType =  {
  status: "NOT_AVAILABLE" | "SOLD_OUT" | "MODIFIED_QUANTITY";
  memberTiers: string[];
  name: string;
  skuCode: string;
  posQuantity: number | null;
  dimButton: boolean;
  isPromotion: boolean;
  branchName: string;
  cartKey?: string;
  effectivePeriodMessage?: string;
}

export type CartApiAlertCode = string | "38003_normal_add_first_item" | "38007_normal_add_first_item" | "38007_normal_add_first_item" |
"38006_normal_add_first_item" | "38005_normal_add_first_item" | "38004_normal_add_first_item" | "38000_normal_edit_store_time" | 
"38005_normal_adjust_qty_or_add_item" | "38007_normal_adjust_qty_or_add_item" | "33011" | "33012" | "38003_normal_adjust_qty_or_add_item" |
"38004_normal_adjust_qty_or_add_item" | "38006_normal_adjust_qty_or_add_item" | "38006_platter_add_first_item" |
"38003_platter_add_first_item" | "38007_platter_add_first_item" | "38005_platter_add_first_item" | "g58" | "g60" |
"38003_platter_platter_finish" | "38007_platter_platter_finish" | "38006_platter_platter_finish" | "38005_platter_platter_finish" |
"38004_platter_platter_finish" | "38000_cart_adjust_qty_or_add_item" | "38003_cart_adjust_qty_or_add_item" | "38000_cart_edit_store_time" |
"38000_cart_checkout" | "38007_cart_adjust_qty_or_add_item" | "38006_cart_adjust_qty_or_add_item" | "38005_cart_adjust_qty_or_add_item" |
"38004_cart_adjust_qty_or_add_item" | "38000_addon_checkout" | "38000_addon_adjust_qty_or_add_item" | "38003_addon_adjust_qty_or_add_item" |
"38004_addon_adjust_qty_or_add_item" | "38000_confirm_edit_store_time" | "38000_confirm_confirm" | "38003_platter_adjust_qty_or_add_item" | 
"38007_platter_adjust_qty_or_add_item" | "38005_platter_adjust_qty_or_add_item" | "38004_platter_adjust_qty_or_add_item" | "38006_platter_adjust_qty_or_add_item" |
"38014_cart_adjust_qty_or_add_item" | "38015_cart_adjust_qty_or_add_item" | "38016_cart_adjust_qty_or_add_item" | "38018_cart_adjust_qty_or_add_item" |
"38013_cart_edit_store_time" | "38013_addon_checkout" | "34013" | "34001" | "34011" | "34000" | "34012" | "34003" | "34009" | "38019_cart_adjust_qty_or_add_item" |
"38020_cart_adjust_qty_or_add_item" | "38013_cart_adjust_qty_or_add_item" | "38012" | "g62" | "g68" | "g56" | "38004_platter_add_first_item" |
"38022_cart_adjust_qty_or_add_item" | "38021" | "38017_cart_adjust_qty_or_add_item" | "38022_cart_checkout" | "38022_addon_checkout" |
"38022_addon_adjust_qty_or_add_item" | "38017_addon_adjust_qty_or_add_item" | "38022_confirm_confirm" | "38022_confirm_edit_store_time";

export type CartApiAlertType = "popup" | "reminder" | "static" | "next_to_field";

export type CartApiAlertListType = {
  alertCode: CartApiAlertCode;
  alertMessage: string;
  alertType: CartApiAlertType;
  alertItems: CartApiAlertItemType[];
}

export type CartApiDataType = {
  cart?: {
    deliveryMethod?: {
      datetime: string | undefined; // have value only if type === "PICKUP"
      // "EFFECTIVE" -> instant, "PICKUP" -> advance
      type: PickUpMethodType;
    };
    isCartLocked: boolean;
    branch: CartBranchType;
    modifiers: ModifiersType[];
    cartItems: CartItemType[];
    gifts: CartItemType[];
    itemCount: number; // total item count,
    // alertItems: {
    //   status: "NOT_AVAILABLE" | "SOLD_OUT" | "MODIFIED_QUANTITY";
    //   name: string;
    //   posQuantity: number | null; // have value only if status === "MODIFIED_QUANTITY"
    // }[];
    promotion?: {
      autoSelectPaymentMethodId: PAYMENT_METHOD;
    },
    summary: {
      itemTotal: string;
      discount: string;
      totalAmount: string;
      summaryDiscount: {
        discount: string;
        promotionMessage: string;
      }[];
      maxMemberPointRedeem: number;
      totalAmountBeforeMemberPointRedeem?: string;
      memberPointRedeemPrice?: string;
    };
  };
  recommendationList?: RecommendationType[];
  recommendationId?: number;
  result?: CartApiResultType;
  itemCount?: number;
  alertList?: CartApiAlertListType[];
};

// export type OnAddToCartClickResponseType =
//   | "UPDATE_QUANTITY_SUCCESS"
//   | "OPEN_FIRST_TIME_POPUP"
//   | "OPEN_SET_PRODUCT_POPUP"
//   | "33008"
//   | "ERROR";

// ---------------------------------------- for api ----------------------------------------
export type AddCartResponseType<T extends "isCartPage" | ""> = 
T extends "isCartPage" ? CartApiDataType : {
  itemCount: number;
}

export type RefCategoryType = "CATEGORY" | "SUBCATEGORY" | "RECOMMENDATION" | "MY_FAVORITE" | "ADD_ON";

export type AddCartSourceType = "" | "normal" | "cart" | "checkout" | "order-form" | "confirm" | "addon";

export type GetRefCategoryDataType = {
  selectedMainCategoryId?: number;
  selectedSubCategoryId?: number;
} & RefCategoryBasicType;

export type RefCategoryBasicType = {
  refCategoryType?: RefCategoryType;
  refCategoryTypeId?: number | string;
};

export type AddCartInputType = {
  source: AddCartSourceType;
  isContinue?: boolean;
  skuCode?: string;
  quantity?: number;
  cartId?: string;
  branchCode?: string;
  cartKey?: string;
  /**
   * input null for instant order. optional
   */
  pickupDatetime?: string | null;
  isGift?: boolean;
  /**
   * for set item, need all sub-items input (update at once)
   */
  subItems?: { skuCode: string; quantity: number }[];
  isCartPage?: boolean;
  modifiers?: {
    [key: string]: boolean;
  };
  refCategoryType?: RefCategoryType;
  refCategoryTypeId?: number | string;
};

export type SetProductDataInLocalCartType = {
  subItems: ProductDataInLocalCartType[];
} & ProductDataInLocalCartType;

export type ProductDataInLocalCartType = {
  skuCode: string;
  quantity: number;
  cartKey?: string;
};

export type DeleteAllCartDataResponseType = {
  result: "CART_EXPIRED";
};
