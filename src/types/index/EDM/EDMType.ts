export interface orderSummaryProps {
    id:number;
    title:string;
    jpTopTitle:string;
    amount:number;
    tag:{
        id:number;
        tagName:string;
        discount:number;
        price:number;
    };
}

export interface addOnProps {
    id:number;
    title:string;
    jpTopTitle:string;
    amount:number;
    tag:{
        id:number;
        tagName:string;
        discount:number;
        price:number;
    };
}

export interface EDMDBProps {
    orderNum:string;
    orderTime:string;
    memberName:string;
    qrCodeNum:string;
    pickupTime:string;
    storeName:string;
    storeAddress:string;
    contactNum:string;
    orderSummary:orderSummaryProps[];
    addOn:addOnProps[];
    soy:boolean;
    wasabi:boolean;
    ginger:boolean;
    payment:string;
    CCNum:string;
    firstName:string;
    lastName:string;
    pickupEmail:string;
    pickupNum:string;
    }