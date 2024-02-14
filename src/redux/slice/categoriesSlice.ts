import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CategoriesTypes, SetCategorySlugAndId, CategoriesStoreType } from "@/types/categorysTypes";

const initialState: CategoriesStoreType = {
  selectedMainCategorySlug: "",
  selectedSubCategorySlug: "",
  list: [],
  defaultList: [],
  currentCategory: 0,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    getCategories: (state, action: PayloadAction<CategoriesTypes[]>) => {
      state.defaultList = action.payload;
    },
    setCategories: (state, action: PayloadAction<CategoriesTypes[]>) => {
      state.list = action.payload;
      state.selectedMainCategorySlug = action.payload[0].slug;
      if (action.payload[0]?.subcategories?.[0]?.slug) {
        state.selectedMainCategorySlug = action.payload[0]?.subcategories?.[0]?.slug;
      }
    },
    setMainCategorySlugAndId: (state, action: PayloadAction<SetCategorySlugAndId>) => {
      state.selectedMainCategorySlug = action.payload.slug;
      state.selectedMainCategoryId = action.payload.id;
    },
    setSubCategorySlugAndId: (state, action: PayloadAction<SetCategorySlugAndId>) => {
      state.selectedSubCategorySlug = action.payload.slug;
      state.selectedSubCategoryId = action.payload.id;
    },
    setCategoriesPosition(state, action: PayloadAction<number>) {
      state.currentCategory = action.payload;
    },
  },
});

export const {
  getCategories,
  setCategories,
  setMainCategorySlugAndId,
  setSubCategorySlugAndId,
  setCategoriesPosition,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
