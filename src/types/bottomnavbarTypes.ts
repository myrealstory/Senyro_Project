import { Url } from "next/dist/shared/lib/router/router";
import { StaticImageData } from "next/image";

export interface BottomNavItems {
  id: string;
  title: string;
  imageDeactivated: StaticImageData;
  imageActivated: StaticImageData;
  link: Url;
  alt: string;
  unread?: number;
}
