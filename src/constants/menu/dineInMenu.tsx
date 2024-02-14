export interface MenuDetail {
  id: number;
  isNew: boolean;
  published: string;
  title: string;
  titleTC?: string;
  subtitle: string;
  subtitleTC?: string;
  content: string;
  contentTC?: string;
  tags: string[];
  image: string;
}
export interface DineInMenu {
  menuDetail: MenuDetail[];
}

export const dineInMenu: MenuDetail[] = [
  {
    id: 1,
    isNew: true,
    image:
      "https://order.genkisushi.com.hk/media/dineinmenu/2304_Homepage_News_Genki_Lunch_Tea_online_ordering__1308Wx1692H__Lunch_C.jpg",
    title: "sen-ryo ultimate Menu",
    titleTC: "午食之選",
    subtitle: "Subtitle demo subtitle demo1",
    subtitleTC: "午食之選副標題",
    tags: ["dineIn", "walkInTakeaway", "onlineTakeaway"],
    published: "2022/05/20",
    content:
      "This lunch menu meticulously selects a variety of Japanese dishes to cater to diverse tastes. From classic sushi and sashimi to creatively prepared fried and grilled dishes, each dish showcases the chef's culinary expertise. We also offer special soups and side dishes to make your lunch even more delightful. Whether it's a business lunch or a gathering with friends, our 'Choice for Lunch' is sure to provide an unforgettable dining experience.",
    contentTC:
      "這份午食菜單精心挑選了多種日式料理，以滿足各種口味。從經典的壽司、刺身到創意豐富的炸物和燒烤，每一道菜都展現了廚師的精湛手藝。此外，我們還提供了特製的湯品和小菜，讓您的午餐更加完美。無論是商務午餐還是與朋友相聚，我們的「午食之選」都能帶給您難忘的美食體驗。",
  },
  {
    id: 2,
    isNew: false,
    image:
      "https://order.genkisushi.com.hk/media/dineinmenu/2304_Online_Order_Genki_Lunch_Tea_online_ordering__1308Wx1692H__C.jpg",
    title: "sen-ryo Sliver Menu",
    titleTC: "極上壽司定食",
    subtitle: "Subtitle demo subtitle demo2",
    subtitleTC: "午食之選副標題",
    tags: ["dineIn", "onlineTakeaway"],
    published: "2022/05/25",
    content:
      "The 'Ultimate Sushi Set Meal' is a homage to traditional Japanese cuisine. We select the freshest seafood from around the world, paired with specially prepared sushi rice, offering a richly layered flavor with every bite. In addition to classic options, we offer seasonal special sushi, ensuring a new surprise with each visit. Paired with selected sake or Japanese tea, the 'Ultimate Sushi Set Meal' is sure to meet all your expectations of Japanese cuisine.",
    contentTC:
      "「極上壽司定食」是對傳統日本美食的致敬。我們嚴選來自全球各地的新鮮海鮮，搭配特製醋飯，每一口都充滿了層次豐富的風味。除了經典選項，我們還提供季節限定的特色壽司，讓您每次光臨都有新的驚喜。搭配精選的清酒或日式茶飲，「極上壽司定食」絕對能滿足您對日本料理的所有期待。",
  },
  {
    id: 3,
    isNew: true,
    image:
      "https://order.genkisushi.com.hk/media/dineinmenu/2304_Homepage_News_Genki_Lunch_Tea_online_ordering__1308Wx1692H__Tea_C.jpg",
    title: "Wine Menu",
    titleTC: "午後的三食",
    subtitle: "Subtitle demo subtitle demo3",
    subtitleTC: "午食之選副標題",
    tags: ["walkInTakeaway", "onlineTakeaway"],
    published: "2022/06/03",
    content:
      "'Afternoon Delights' is a menu designed for enjoying leisurely afternoon hours. We offer a variety of light fare, including handmade sandwiches, exquisite desserts, and seasonal fruits, accompanied by our carefully brewed coffee or tea. Additionally, we have special afternoon tea sets, including classic English tea and Japanese-style tea treats, perfect for relaxing and enjoying a pleasant afternoon.",
    contentTC:
      "「午後的三食」是一份專為享受悠閒下午時光而設計的菜單。我們提供各式各樣的輕食，如手工三明治、精緻甜點和季節水果，搭配我們精心調製的咖啡或茶。此外，我們還有特色的下午茶套餐，包括經典的英式下午茶和日式風味茶點，都是放鬆心情、享受美好午後的絕佳選擇。",
  },
  {
    id: 4,
    isNew: false,
    image:
      "https://order.genkisushi.com.hk/media/dineinmenu/2023_Core_Menu_Online_Ordering_Site_News___Updates_Cover.jpg",
    title: "Golden Menu",
    titleTC: "賞味。賞目",
    subtitle: "Subtitle demo subtitle demo4",
    subtitleTC: "賞味。賞目副標題",
    tags: ["dineIn", "walkInTakeaway", "onlineTakeaway"],
    published: "2022/06/11",
    content:
      "The 'The 'Taste and Visual Feast' menu is not only a feast for the taste buds but also a delight for the eyes. Our dishes are not only delicious but also artistic, each like a carefully designed work of art. From brightly colored appetizers to exquisite main courses, each is a masterpiece of our chefs. This menu is suitable for those who seek not only culinary delights but also appreciate the art of fine dining.",
    contentTC:
      "「賞味。賞目」菜單不僅是味蕾的盛宴，更是視覺的饗宴。我們的菜品不僅美味，還極具藝術感，每道菜都像是精心設計的藝術品。從色彩鮮豔的前菜到精緻的主菜，每一道都是我們廚師匠心的結晶。這份菜單適合那些不僅追求味覺享受，同時也欣賞美食藝術的食客。",
  },
  {
    id: 5,
    isNew: true,
    image:
      "https://order.genkisushi.com.hk/media/dineinmenu/2023_Core_Menu_Online_Ordering_Site_News___Updates_Cover_Takeaway_Menu_Cover.jpg",
    title: "Tuna Festival Menu",
    titleTC: "外賣之選",
    subtitle: "Subtitle demo subtitle demo5",
    subtitleTC: "外賣之選副標題",
    tags: ["dineIn", "walkInTakeaway", "onlineTakeaway"],
    published: "2022/07/03",
    content:
      "The 'Choice for Takeaway' menu is specially designed for customers who enjoy dining at home or in the office. Our takeaway service is not only fast but also guarantees the freshness and flavor of the food. From traditional Japanese ramen and sushi to innovative fusion cuisine, each takeaway is a testament to our commitment to quality and taste. Whether it's a busy weekday lunch or a comfortable weekend evening, our takeaway options cater to your convenience and craving.",
    contentTC:
      "「外賣之選」菜單專為喜愛在家中或辦公室享用美食的顧客設計。我們的外賣服務不僅迅速，而且保證食物的新鮮和口味。從傳統的日式拉麵、壽司到創新的融合料理，每一份外賣都是我們對品質和口味的堅持。無論是忙碌的工作日午餐或是舒適的周末都能好好享受。",
  },

  {
    id: 6,
    isNew: false,
    image: "https://dummyimage.com/725x937/000/fff&text=6",
    title: "Tuna Festival Menu",
    titleTC: "午食之選6",
    subtitle: "Subtitle demo subtitle demo6",
    subtitleTC: "平日午間套餐",
    tags: ["dineIn", "onlineTakeaway"],
    published: "2022/07/03",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    contentTC: "平日午間套餐平日午間套餐平日午間套餐平日午間套餐平日午間套餐平日午間套餐",
  },
  {
    id: 7,
    isNew: true,
    image: "https://dummyimage.com/725x937/000/fff&text=7",
    title: "Tuna Festival Menu",
    titleTC: "全面八折",
    subtitle: "Subtitle demo subtitle demo7",
    subtitleTC: "開幕期間全部商品八折折扣",
    tags: ["walkInTakeaway", "onlineTakeaway"],
    published: "2022/07/03",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    contentTC:
      "開幕期間全部商品八折折扣開幕期間全部商品八折折扣開幕期間全部商品八折折扣開幕期間全部商品八折折扣開幕期間全部商品八折折扣開幕期間全部商品八折折扣",
  },
];

export const MenuContent = [
  {
    name: "Latest News",
    translate: "button1",
    link: "news-offers",
  },
  {
    name: "Store Locator",
    translate: "button2",
    link: "store-location",
  },
  {
    name: "Membership Program",
    translate: "button3",
    link: "membership-program",
  },
  {
    name: "FAQ",
    translate: "button4",
    link: "faqs",
  },
  {
    name: "Catering Enquiry",
    translate: "button5",
    link: "campaign",
  },
  {
    name: "Contact US",
    translate: "button6",
    link: "contact",
  },
  {
    name: "About Us",
    translate: "button7",
    link: "about",
  },
  {
    name: "Dine-in menu",
    translate: "button8",
    link: "dine-in-walking-in-menu",
  },
  {
    name: "Food Safety",
    translate: "button9",
    link: "quality-ingredient",
  },
];
