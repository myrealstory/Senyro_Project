import { bannerDBProps } from "@/types/index/indexType";
// import { MainProductType,SubProductType } from "@/types/productTypes";

export const bannerDB: bannerDBProps[] = [
  {
    id: 1,
    images: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1684811245/senryo-coremenu-banner_apptizer_ytkwzr.png",
    content:
      "Filled with premium ingredients and specially curated for you to enjoy your precious lunch hour! Starting from just $120.",
    caption: "appetizer",
    title: "Sen-ryo Bento",
  },
  {
    id: 2,
    images: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1685937358/Page_2_State_Default_nzza93.png",
    content:
      "Filled with premium ingredients and specially curated for you to enjoy your precious lunch hour! Starting from just $120.",
    caption: "sushiSample2",
    title: "Sen-ryo Bento",
  },
  {
    id: 3,
    images: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1684811245/Vegetarian-Sushi-Rolls_arhpeb.jpg",
    content:
      "Filled with premium ingredients and specially curated for you to enjoy your precious lunch hour! Starting from just $120.",
    caption: "SushiRolls",
    title: "Sen-ryo Bento",
  },
];

export interface SubProductType {
  skuCode: string;
  name: string;
  quantity: string;
}
