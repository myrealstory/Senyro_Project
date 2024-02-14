import { LocaleKeysType } from "@/app/i18n";

import { AddOnListType } from "./addOnTypes";
import { CardDetailType } from "./checkout/checkoutTypes";
import { CategoriesTypes } from "./categorysTypes";
import { MainProductType, ProductPriceType, RecommendationType, SubProductType } from "./productTypes";
import { AddCartSourceType, CartApiDataType, CartItemType, CartTableModeType, RefCategoryBasicType } from "./cartTypes";
import {
  GetApplepayMerchantInfoResponse,
  GetGooglepayMerchantInfoResponse,
  PaymentConfigType,
  ProfileResType,
  SaveCardType,
} from "./api/apiTypes";
import { FetchResponse } from "./commonTyps";
import { Stores } from "@/types/api/apiTypes";
import { PromotionalMessageApiType } from "@/types/api/apiTypes";
import React from "react";
import { StaticImageData } from "next/image";
import { AlertMessageType } from "./generalTypes";

export type ProductCartType = {
  containerClasses?: string;
  product: MainProductType & { addonPrice?: string; price?: string };
  isHorizontalMode?: boolean;
  isAddOnMode?: boolean;
  lang: LocaleKeysType;
  path?: string;
  isMemberFavoriteMode?: boolean;
  id: string;
  source: AddCartSourceType;
  isPLP?: boolean;
} & RefCategoryBasicType;

export type AddToCartButtonType<T extends "isMainProduct" | "isSubProduct" | "isCartPage"> = {
  source: AddCartSourceType;
  mode?: "CALCULATOR" | "FULL_BUTTON" | "SHORT_BUTTON" | "EDIT_BUTTON";
  product: T extends "isMainProduct"
    ? MainProductType
    : T extends "isSubProduct"
    ? SubProductType["subProduct"]
    : T extends "isCartPage"
    ? CartItemType["item"] & { cartKey: string }
    : never;
  containerClasses?: string;
  type?: "largeSize" | "smallSize";
  lang: LocaleKeysType;
  disable?: boolean;
  isAllowZero?: boolean;
  currentBottom?: number;
  defaultValue?: number;
  isGiftItem?: boolean;
  isPLP?: boolean;
  path?: string;
} & RefCategoryBasicType;

export type CategoryListType = {
  data: CategoriesTypes[];
};

export type ProductDetailType = {
  data: MainProductType;
  lang: LocaleKeysType;
  promotionalMsgData: PromotionalMessageApiType;
  isPromotionalMsgSuccess: boolean;
};

export type DeliveryBarType = {
  data: CartApiDataType;
  lang: LocaleKeysType;
  isCartMode: boolean;
  miniMode?: boolean;
  width?: number;
};

export type ReduxProviderType = {
  children: React.ReactNode;
  lang: LocaleKeysType;
  initValue: {
    addCartAfterMemberLogin: FetchResponse<CartApiDataType> | undefined;
    cart: FetchResponse<CartApiDataType> | undefined;
    profile: FetchResponse<ProfileResType["data"]> | undefined;
  };
};

export type QuotaAlertType = {
  isOpen: boolean;
  containerStyle?: string;
  content?: string;
  style: AlertMessageType["reminderIconStyle"];
};

export type OTPAlertType = {
  maxAttempAllow: number;
  numberOfAttempt: number;
};

export type RecommendType = {
  mode: "NORMAL" | "ADD-ON";
  recommendData: RecommendationType[];
  recommendId?: number | undefined;
};

export type CustomScrollBarType = {
  currentX: number;
  currentY?: number;
  children?: React.ReactElement;
  width: number;
  scrollBarWidth: number;
  scrollRef: React.RefObject<HTMLDivElement>;
  showScrollBar: boolean;
  buttonTap: boolean;
  height: number;
  itemAmount: number;
  containerClasses?: string;
  renderMode?: "ADD-ON" | "NORMAL";
};

export type PriceBadgesType = {
  leftBadge: ProductPriceType[];
  rightBadge?: ProductPriceType[];
  containerClasses?: string;
  badgeClasses?: string;
  textClasses?: string;
  isMemberFavoriteMode?: boolean;
  badgeContainerClasses?: string;
};

export type FloatingType = {
  close?: (...params: any) => any;
};

type CartPickupMode = {
  mode: "NEW" | "EDIT" | null;
};

export type CartPickupType = {
  title?: string;
  onClose?: (...params: any) => any;
  lang: LocaleKeysType;
} & CartPickupMode;

export type CartPickupStep1Type = {
  lang: LocaleKeysType;
} & CartPickupMode;

export type CartPickupStep2Type = CartPickupStep1Type;

export type CartPickupStep3Type = {
  lang: LocaleKeysType;
};

export type CartTableType = {
  mode: CartTableModeType;
  cartData: CartItemType[];
};

export type CustomSwitchType = {
  // language for language switch used
  // add-on for cart or menu switch used
  type: "language" | "add-on";
  label?: string;
  mobile?: boolean;
  desktop?: boolean;
  value?: boolean;
  pick?: boolean;
  onClick?: (...params: any) => any;
};

export type SlidePanelType = {
  mode: "NORMAL" | "CHECKOUT";
  onClick: () => void;
  lang: LocaleKeysType;
  isEditButtonHidden?: boolean;
  disabled?: boolean;
  containerStyle?: string;
};

export type MobileButtonContainerType = {
  children: JSX.Element;
  containerClass?: string;
  zIndex?: number;
};

export type AddOnContentType = {
  addOnList: AddOnListType;
  lang: LocaleKeysType;
};

export type MobileCartTableType = {
  mode: CartTableModeType;
  containerClass?: string;
  cartData: CartItemType[];
  lang: LocaleKeysType;
};

export type TypeOfCustomInputType = "TEXT" | "NUMBER" | "OPTION" | "EMAIL" | "TEL";

export type CustomInputType = {
  errorImg?: StaticImageData | string;
  name?: string;
  disabled?: boolean;
  label?: string;
  type: TypeOfCustomInputType;
  placeholder: string;
  hasError: boolean;
  error?: string | undefined;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number | null | undefined;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  leftComponent?: () => JSX.Element | null;
  rightComponent?: () => JSX.Element | null;
  maxLength?: number;
  pattern?: string;
  onBlur?: (...params: any) => any;
  containerClasses?: string;
  remainLabelHeight?: boolean;
  onWheel?: (event: React.WheelEventHandler<HTMLInputElement>) => void;
  successMessage?: string;
  labelClasses?: string;
  textClasses?: string;
  disabledTextClasses?: string;
  path?: string;
};

export type CheckoutFormType = {
  lang: LocaleKeysType;
  isCheckoutTimeout: boolean;
};

export type CreditCardInputType = {
  disableQRCodePopup?: boolean;
  handleDeleteCard: (cartId: string) => void;
  id: string;
  setSelectedCard: (cardId: string) => void;
  checked: boolean;
  value: string;
  name: string;
  card: SaveCardType;
  profile?: ProfileResType["data"];
  checkoutForm?: boolean;
  isDisplayCVV?: boolean;
  isAE?: boolean;
};

export type CreditCardType = {
  onClick?: (...params: any) => any;
  isAE?: boolean;
  disableQRCodePopup?: boolean;
  card: {
    id: string;
    cardNumber: string;
    cardExpiryYear: number;
    cardExpiryMonth: number;
    cardImage: string;
    cardBankType: string;
    qrcodeStr: string;
  };
  profile?: ProfileResType["data"];
  path: string;
  lang: LocaleKeysType;
  onDelete: (cardId: string) => void;
  containerStyle?: string;
  MRight?: boolean;
  checkoutForm?: boolean;
  isDisplayCVV?: boolean;
};

export type PaymentMethodProps = {
  checked: boolean;
  onChange: () => void;
  onCreditCardInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  extra?: {
    creditCardData?: CardDetailType;
    paymentConfig?: PaymentConfigType;
  };
  onMobilePaymentSelected?: (params: GetApplepayMerchantInfoResponse | GetGooglepayMerchantInfoResponse) => any;
  onCreditCardInputDone?: (...params: any) => any;
  onTooltipClick?: (...params: any) => any;
  containerClasses?: string;
};

export type GPSType = {
  lang: LocaleKeysType;
  onActivate?: (params: GeolocationPosition["coords"]) => any;
  onDeactivate?: (...params: any) => any;
};

export type CustomCheckboxType = {
  label: string;
  description?: string | JSX.Element;
  children?: JSX.Element;
  onCheck?: (...params: any) => any;
  isChecked: boolean;
  disable?: boolean;
  containerClasses?: string;
  extraInfo?: {
    topRightText?: string | null | number | JSX.Element;
    bottomText?: string | null | JSX.Element;
  };
};

export type FavouriteType = {
  containerClasses?: string;
  isFavourite: boolean;
  isMemberFavoriteMode?: boolean;
  onDelete?: (skuCode: string) => void;
  onAdd?: (skuCode: string) => void;
  skuCode?: string;
  darkmode: boolean;
};

export type StoreUpModalType = {
  lang: LocaleKeysType;
  storeLists: Stores[];
  selectdStore: Stores;
  setSelectdStore: React.Dispatch<React.SetStateAction<Stores>>;
  activeMarker: number | null;
  setActiveMarker: React.Dispatch<React.SetStateAction<number | null>>;
  searchBoxArray: Stores[];
  setSearchBoxArray: React.Dispatch<React.SetStateAction<Stores[]>>;
  setDefaultProps: React.Dispatch<React.SetStateAction<{ center: { lat: number; lng: number }; zoom: number }>>;
  setIsClickedGPS: React.Dispatch<React.SetStateAction<boolean>>;
  myLocationByGPS: { center: { lat: number; lng: number } };
  setMyLocationByGPS: React.Dispatch<React.SetStateAction<{ center: { lat: number; lng: number } }>>;
  isClickedGPS: boolean;
  setIsDistictSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setStoreListsState: React.Dispatch<React.SetStateAction<Stores[]>>;
};

type Select = {
  region: string;
  district: string;
};

export type StoreCardsType = {
  values: Select;
  openModal: boolean;
  storeLists: Stores[];
  selectdStore: Stores;
  setSelectdStore: React.Dispatch<React.SetStateAction<Stores>>;
  activeMarker: number | null;
  setActiveMarker: React.Dispatch<React.SetStateAction<number | null>>;
  searchBoxArray: Stores[];
  setSearchBoxArray: React.Dispatch<React.SetStateAction<Stores[]>>;
  isClickedGPS: boolean;
  lang: LocaleKeysType;
  setIsHalfModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterdStoreLength: React.Dispatch<React.SetStateAction<number>>;
  setSelectedStoreListFromSelecor: React.Dispatch<React.SetStateAction<Stores[]>>;
  selectVal: Select;
  dragModalMode?: string;
  scrollToElement?: (...params: any) => any;
  snapFromFulltoHalf?: () => void;
  onClickToScroll?: (...params: any) => any;
  focusRef?: React.RefObject<HTMLDivElement>;
  setGpsStoreArray?: React.Dispatch<React.SetStateAction<Stores[]>>;
};

export type MapDraggingModalType = {
  openModal?: boolean;
  handleOpenModal?: () => void;
  filterdStoreLength?: number;
  width?: number;
  handleGPSonClick?: () => void;
  isClickedGPS?: boolean;
  regionArray?: string[];
  handleRegionSelectChange?: (name: string, str: string) => void;
  selectVal?: { region: string; district: string };
  isClicked?: boolean;
  isFullModal?: boolean;
  activeIndex?: number;
  setActiveIndex?: (...params: any) => any;
  districtArr?: any;
  handleDistrictSelectChange?: (...params: any) => any;
  isSecondSelectDisabled?: boolean;
  selectdStore?: any;
  storeLists?: any;
  setSelectdStore?: any;
  activeMarker?: any;
  setActiveMarker?: any;
  searchBoxArray?: any;
  setSearchBoxArray?: any;
  setFilterdStoreLength?: any;
  setIsHalfModal?: any;
  setSelectedStoreListFromSelecor?: any;
  setIsFullModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectVal?: React.Dispatch<React.SetStateAction<{ region: string; district: string }>>;
  setGpsStoreArray?: React.Dispatch<React.SetStateAction<Stores[]>>;
  areaArr?: string[];
};

export type StoreCardType = {
  item: Stores;
  setSelectdStore: React.Dispatch<React.SetStateAction<Stores>>;
  setActiveMarker: React.Dispatch<React.SetStateAction<number | null>>;
  isActive: boolean;
  isClickedGPS: boolean;
  lang?: LocaleKeysType;
  setIsHalfModal: React.Dispatch<React.SetStateAction<boolean>>;
  snapFromFulltoHalf?: () => void;
};

export type AvailablePickupTimesApiParamsType = {
  skuCode?: string;
  date?: string;
};
