import { Metadata } from "next";

import { LocaleKeysType } from "@/app/i18n";
import { ServerSidePageType } from "@/types/pageTypes";

export const metadata: Metadata = {
  title: "sen-ryo 千兩",
};

export type ComponentType = {
  lang: LocaleKeysType;
};

export default function DefaultPage({}: ServerSidePageType) {
  return "Default Page";
}
