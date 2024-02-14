import { RefObject } from "react";
import { ComponentType } from "@/app/[lang]/page";

export const addOnItems = ["Soy Sauce", "Wasabi", "Ginger"];
export interface CTAType extends ComponentType {
  price: number;
  qty: number;
  handler: () => void;
}

export interface CTAType {
  price: number;
  qty: number;
}

export interface CartSummaryType {
  desciption?: string;
  handlers: (() => void)[];
}

export interface CartSummaryDataType {
  discountName: string;
  discount: number;
  desciption?: string;
}

export interface addOnSauceDataType {
  id: number;
  label: string;
  value: boolean;
}

export interface OrderSummaryType {
  ref: RefObject<HTMLDivElement>;
  handlers?: (() => void)[];
  buttonName?: string;
  addOn: boolean;
  checkout?: boolean;
}
