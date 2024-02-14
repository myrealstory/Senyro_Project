import { LocaleKeysType } from "@/app/i18n";
import { MainProductType, RecommendationType } from "./productTypes";
import { CategoriesTypes } from "./categorysTypes";

export type ServerSidePageType = {
  params: {
    lang: LocaleKeysType;
  };
  searchParams?: {
    [query: string]: string;
  };
};

export type ClientSidePageType = {
  lang: LocaleKeysType;
};

export type IndexContentType = {
  data: {
    productList: MainProductType[];
    recommendation: RecommendationType[];
    redommendationId: number;
    categories: CategoriesTypes[];
  };
  lang: LocaleKeysType;
  mainCategorySlug?: string;
  subCategorySlug?: string;
};

export type CartType = {
  lang: LocaleKeysType;
};

export type AddOnType = {
  lang: LocaleKeysType;
}

export type IndexType = {
  mainCategorySlug?: string;
  subCategorySlug?: string;
} & ServerSidePageType;

export type IndexWithCategorySlugType<T extends "MAIN" | "SUB"> = {
  params: ServerSidePageType["params"] & {
    mainCategorySlug: string;
    subCategorySlug: T extends "SUB" ? string : never;
  };
} & ServerSidePageType;
