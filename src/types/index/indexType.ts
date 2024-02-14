import { ComponentType } from "@/app/[lang]/page";
import { HeroBannerType } from "@/types/api/apiTypes";

export interface bannerDBProps {
  id?: number;
  content?: string;
  caption?: string;
  images: string;
  title: string;
}

export interface mainButtonProps {
  name: string;
  backgroundUrl: string;
}
//************************SlideButton Type**************************************//

export interface SlideButtonProps extends ComponentType {
  data: mainButtonProps[];
  handle: (index: number) => void;
}

export interface ButtonBodyProps {
  button: mainButtonProps;
  index: number;
  setSelectIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedIndex: number;
  handle: (index: number) => void;
}

//************************ProductItems Type**************************************//

export interface DiscountTagProps {
  discount: number;
  price: string;
  style?: string;
  noLine?: boolean;
}

/************************Banner  Type**************************/

export interface BannerProps {
  // images: string[] | bannerDBProps[];
  images: string[] | HeroBannerType[];
  isProduct?: boolean;
  remark?: string;
  darkmode?: boolean;
}

export interface LocalStorageProps {
  // Get an item from local storage by key
  get<T>(key: string): { status: number; data: T };

  // Set an item in local storage by key
  post<T>(key: string, value: T): { status: number };

  // Remove an item from local storage by key
  delete(key: string): { status: number };
}
