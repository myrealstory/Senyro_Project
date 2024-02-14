import { ROUTES } from "@/constants/routes";
import { ENDPOINTS } from "@/constants";
import { PageConfigType, WidgetConfigType } from "@/types/commonTyps";

const PageConfig: PageConfigType = {
  isDisplayFooter: [
    ROUTES.INDEX,
    ROUTES.PRODUCT,
    ROUTES.ABOUT,
    ROUTES.MEMBER,
    ROUTES.ORDER_COMPLETE,
    ROUTES.MEMBERSHIP_PROGRAM,
    ROUTES.CONTACT,
    ROUTES.CAMPAIGN,
    ROUTES.REGISTRATION,
    ROUTES.LOGIN,
    ROUTES.CHECKOUT,
    ROUTES.CART, // including /add-on
    ROUTES.FAQ,
    ROUTES.QUALITYOFINGREDIENT,
    ROUTES.LATEST_NEWS,
    ROUTES.MENU,
    ROUTES.GENERAL_PAGE,
    ROUTES.CAMPAIGN_FORM,
    ROUTES.OTP_OUT_EMAIL,
    ROUTES.ERROR_404,
    ROUTES.TERMS_AND_CONDITION,
    ROUTES.PRIVACY_AND_POLICY,
    ROUTES.MEMBER_TERMS,
    ROUTES.NEWS_OFFERS_VIDEO_DEMO,
    ROUTES.VERIFY_NEW_USER_EMAIL,
    ROUTES.MEMBER_INBOX_PERSONAL,
    ROUTES.MEMBER_INBOX_PROMOTION,
    ROUTES.MEMBER_PAY_WITH_CARDS,
    ROUTES.MEMBER_TRANSACTION,
    ROUTES.TRANSACTION_INSTORE,
    ROUTES.TRANSACTION_ONLINE,
    ROUTES.COUPON_VALID,
    ROUTES.COUPON_EXPIRED,
  ],
  needsToLogin: [ROUTES.MEMBER],
  // 用途：進入該page，先檢查有沒有data ( from api response )，如果沒有data，則不顯示 root/layout
  // 同時，該page (ex: add-on/page.tsx)，也需要redirect 去指定page
  isNestPage: {
    [ROUTES.ADD_ON]: {
      api: ENDPOINTS.GET_ADD_ON_LIST,
      dataKey: "addonProducts",
    },
  },
};

const WidgetConfig: WidgetConfigType = {
  topErrorMessageBar: {
    env: ["LOCAL", "DEV", "SIT", "UAT"],
  },
  reduxLooger: {
    env: ["LOCAL", "DEV"],
  },
  registrationFormChecking: {
    env: ["LOCAL", "DEV"],
  },
};

const SupportedBrowserConfig = ["chrome", "firefox", "safari", "edge"];

export { PageConfig, WidgetConfig, SupportedBrowserConfig };
