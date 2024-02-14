import { RegistrationProps } from "@/types/form/formTypes";
import { StaticImageData } from "next/image";

export type Points = {
  points: number;
  expiry: string;
};

export interface CreditCardProps {
  id: string;
  cardHolderName: string;
  cardNumber: string;
  cardType: string;
  expiryDate: string;
  CVV: string;
}

export interface Tags {
  id: number;
  tagName: string;
  discount: number;
  price: number;
}

export type TransactionType = "In-store" | "Online";

export interface TransactionInstore {
  type: "In-store" | "Online";
  orderNumber: number;
  orderDate: string;
  store: string;
  orderDateTime: string;
  memberPoints: number;
  earnPoint: number;
  burnPoint: number;
  netAmount: number;
  purchasedAmount: number;
  orderAmount?: number;
  receiptDetails: ReceiptDetails[];
}

export interface TransactionOnline extends Omit<TransactionInstore, "receiptDetails"> {
  pickupDate: string;
  onlineReceiptDetails: OnlineReceiptDetails[];
}

export interface TransactionHistory {
  inStoreHistory: TransactionInstore[];
  onlineHistory: TransactionOnline[];
}

export type MessageType = "Personal" | "Promotional";

export interface PersonalMessage {
  id: number;
  type: MessageType;
  title: string;
  subtitle: string;
  content: string;
  read: boolean;
  date: string;
  productImage: React.ReactNode;
}

export type PromotionMessage = PersonalMessage;

export interface Messages {
  personal: PersonalMessage[];
  promotion: PromotionMessage[];
}

export interface UserProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberId: string;
  validUntil: string;
  totalPoints: number;
  srMemberName: string;
  membershipNo: string;
  rank: string;
  pointExpiryDate: Points[];
  savedCards: CreditCardProps[] | [];
  favList: any[] | [];
  pickupOrder: PickupOrders[];
  transactionHistory: TransactionHistory;
  coupons: Coupons;
  messages: Messages;
  upgradeStatus: UpgradeProps;
}

export interface Selected {
  selectedDate: string;
  dateRange?: (orderNumber?: number) => void;
  reset?: () => void;
  edit?: (orderNumber?: number) => void;
}

export interface PickupOrders {
  pickupLocation: string;
  orderDate: string;
  orderNum: string;
  pickupDate: string;
  store: string;
  selected: Selected;
  reorder?: (orderNumber?: number) => void;
  receipt?: (orderNumber?: number) => void;
  pickupCode?: (orderNumber?: number) => void;
}

export type Items = {
  qty: number;
  item: string;
};

export interface ReceiptDetails {
  orderNum: number;
  store: string;
  dateAndTime: string;
  items: Items[];
  amount: number;
  earningPoints: number;
  points: number;
  balance: number;
}

export interface UpgradeProps {
  currentMembership: string;
  currentSpending: number;
  upgradeActivated: boolean;
  renewActivated: boolean;
  upgradeExpiredDate: string;
  toPrestigeSpending?: number;
}

export interface CreditCardForm extends RegistrationProps {
  labelText?: string;
  labelFor: string;
  id: string;
  name: string;
  type: string;
  autoComplete: string;
  isRequired: boolean;
  placeHolder?: string;
}

export interface ValidCoupons {
  image: React.ReactNode;
  couponCode: number;
  couponDescription: string;
  tags: string[];
  validityStart: string;
  validityEnd: string;
  couponDetails: {
    qrcode: React.ReactNode;
    memberNum: string;
    expiryDate: string;
    pass: string;
  };
}

export interface UsedExpiredCoupon extends Omit<ValidCoupons, "couponDetails"> {
  used: boolean;
  expired: boolean;
}

export interface Coupons {
  validCoupons: ValidCoupons[];
  usedExpiredCoupons: UsedExpiredCoupon[];
}

export interface SidebarProps {
  id: string;
  title: string;
  imageMobile?: React.ReactNode;
  imageMobileText?: React.ReactNode;
  imageDesktop?: React.ReactNode;
  imageActivatedMobile?: React.ReactNode;
  imageActivatedMobileText?: React.ReactNode;
  imageActivatedDesktop?: React.ReactNode;
  path?: string;
}

export interface Benefits {
  image: StaticImageData;
  alt: string;
}

export interface SauceStatus {
  itemName: string;
  isChecked: boolean;
}

export interface OnlineItems {
  food?: string;
  title?: string;
  subTotal: number;
  qty: number;
}

export interface Gifts {
  title: string;
  subTotal: number;
  qty: number;
}

export interface PaymentDetails {
  cardHolder: string;
  cardNumber: string;
  cardType: string;
  email: string;
  phone: string;
  SRmemberName: string;
  memberShipNo: string;
}

export interface OnlineReceiptDetails {
  orderNum: number;
  orderDateTime: string;
  qrcodeNum: string;
  pickupTime: string;
  pickupStore: string;
  address: string;
  contact: string;
  sauceStatus: SauceStatus[];
  items: OnlineItems[];
  gift: Gifts[];
  paymentDetails: PaymentDetails;
}
