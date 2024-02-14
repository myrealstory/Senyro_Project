import { ComponentType } from "@/app/[lang]/page";

export interface FooterProps extends ComponentType {
  hideFooter?: boolean;
}

export interface DownContentProps extends ComponentType {
  type: "Content" | "Download" | "Regions";
}
