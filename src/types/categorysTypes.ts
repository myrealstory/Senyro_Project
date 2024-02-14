type CategoriesCommonTypes = {
  id: number;
  status: number;
  nameJp: string;
  name: string;
  slug: string;
  startDatetime: string;
  endDatetime: string;
  displaySequence: number;
  promotionMessagesId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeyword: string | null;
};

export type CategoriesTypes = {
  subcategories: SubCategoriesTypes[];
  mobileIcon: string | null;
  desktopIcon: string | null;
  mobileHoverIcon: string | null;
  desktopHoverIcon: string | null;
} & CategoriesCommonTypes;

export type SubCategoriesTypes = {
  categoriesId: number;
} & CategoriesCommonTypes;

export type SetCategorySlugAndId = {
  slug: CategoriesCommonTypes["slug"];
  id: CategoriesCommonTypes["id"];
};

export type CategoriesStoreType = {
  selectedMainCategorySlug: string;
  selectedMainCategoryId?: number;
  selectedSubCategorySlug: string;
  selectedSubCategoryId?: number;
  list: CategoriesTypes[];
  defaultList: CategoriesTypes[];
  currentCategory: number;
};
