import { EDMDBProps } from "@/types/index/EDM/EDMType";

    
export const EDMDB:EDMDBProps = {
    orderNum:"#1523546648",
    orderTime:"2023/03/23 15:50",
    memberName:"",
    qrCodeNum:"6548",
    pickupTime:"2023/03/23 (Mon) 16:35",
    storeName:"ifc mall",
    storeAddress:"Shop 3099-3100, Podium Level 3, ifc mall, No. 8 Finance St, Central, Hong Kong",
    contactNum:"+852 2722 2221",
    orderSummary:[
        {
            id:11,
            title:"Fatty Tuna with Chives Gunkan",
            jpTopTitle:"ねぎとろ",
            amount:1,
            tag:{
                    id:1,
                    tagName:"List",
                    discount:60,
                    price:570,
                },
        },
        {
            id:42,
            title:"Salmon Roe Gunkan demodemodemo",
            jpTopTitle:"いくら",
            amount:2,
            tag:{
                    id:3,
                    tagName:"Promotion",
                    discount:0,
                    price:46,
                },
        },
        {
            id:30,
            title:"Sen-ryo Sushi Platter",
            jpTopTitle:"甘海老蟹みそ添え",
            amount:2,
            tag:{
                    id:4,
                    tagName:"Silver",
                    discount:0,
                    price:56,
                },
        },
        {
            id:99,
            title:"Utensil",
            jpTopTitle:"",
            amount:4,
            tag:{
                    id:2,
                    tagName:"Basic",
                    discount:0,
                    price:1,
                },
        },
    ],
    addOn:[
        {
            id:30,
            title:"Sen-ryo Sushi Platter",
            jpTopTitle:"甘海老蟹みそ添え",
            amount:1,
            tag:{
                    id:4,
                    tagName:"Silver",
                    discount:0,
                    price:56,
                },
        },
    ],
    soy:true,
    wasabi:true,
    ginger:true,
    payment:"VISA",
    CCNum:"****3208",
    firstName:"Joshua",
    lastName:"Chan",
    pickupEmail:"joshua.chan@gmail.com",
    pickupNum:"9123 9456",
}