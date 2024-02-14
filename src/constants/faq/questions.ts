interface Question {
  question: string;
  answer: string;
}

export interface Faqs {
  category: string;
  categoryTC?: string;
  questions: Question[];
}

export const onlineOrdering: Faqs[] = [
  {
    category: "System Requirements",
    categoryTC: "系統要求",
    questions: [
      {
        question: "What devices can I use to make orders?",
        answer:
          "You may access the online ordering website through any  connected devices including desktop computers, mobile phones or tablets.",
      },
      {
        question: "What are the system requirements for the devices, such as browser version?",
        answer: `We recommend the following setting for the best experience:
          •		Browser:  Explorer 11/ Chrome 31 / Firefox 27 / Safari 7 or above
          •		Recommended screen resolution: 1024x768
          •		Javascript and Cookies turned on`,
      },
      {
        question: "Can I use 2 or more browsers to make orders at the same time?",
        answer:
          "Only one member account session can be active at anytime. If you login with the same account on another device, the original session will be ended.",
      },
      {
        question: "Can I make orders using sen-ryo’s mobile app? ",
        answer: "Online Ordering service is not available on the mobile app.",
      },
    ],
  },
  {
    category: "系統要求",
    questions: [
      {
        question: "我可以透過哪些裝置網上訂購？",
        answer: "您可以透過任何連接到互聯網的電腦、手機或平板電腦經千両外賣自取網上訂購平台訂購。",
      },
      {
        question: "電腦／手機／平板電腦需要甚麼配置？例如瀏覽器、建議解像度及Cookies設定等。",
        answer: `我們建議閣下使用下列之瀏覽器，達致最佳瀏覽效果。
        •		Chrome v77 / Edge v44 / Safari 11或以上
        •		建議解像度: 1366 x 768
        •		必須啟動Javascript及Cookie`,
      },
      {
        question: "我可以同時使用2個或以上的瀏覽器訂購嗎？",
        answer:
          "只能於一個已登錄帳戶的瀏覽器訂購。如果您在另一個瀏覽器上使用相同的帳戶登錄，原先已登錄的瀏覽器便會結束訂購程序。",
      },
      {
        question: "我可經千両手機應用程式進行訂購嗎？",
        answer: "您不可於千両手機應用程式內經外賣自取網上訂購平台進行訂購。",
      },
    ],
  },
  {
    category: "Payment Secruity",
    categoryTC: "付款安全",
    questions: [
      {
        question: "Is it safe to order on the website?",
        answer:
          "It is safe to shop on the website. In order to provide a safe and trustworthy environment for online shopping, sen-ryo has used Secure Socket Layer (SSL). All personal information including your credit card number, name, email address and phone number would undergone encryption before transmitting through , to protect your information from reading by unauthorised third party during transmission.",
      },
      {
        question: "Will my credit card info and security code be stored in the website? ",
        answer:
          "Other than the information of the order, all your credit card info and security code which you inputted will be sent automatically to the card-issuing bank for verification and authorization. Due to security purposes, we will not store these information.",
      },
      {
        question:
          "What is \"Verified By Visa\", \"MasterCard SecureCode\" or “American Express SafeKey”?  Is it a must to register for it?",
        answer:
          "Verified by Visa, MasterCard SecureCode and American Express SafeKey are the secure online payment services that provide you with a personal password for your payment card, giving you added assurance that only you can use your cards to make purchase over the .  Some banks require Verified by Visa or MasterCard SecureCode to authenticate your identity before processing the transaction.",
      },
      {
        question: "How do I activate \"Verified By Visa\" “MasterCard SecureCode” or “American Express SafeKey”? ",
        answer:
          "Please visit your Visa or MasterCard issue’s website for details.  If you have an American Express account, you are automatically registered for American Express SafeKey.  ",
      },
    ],
  },
  {
    category: "付款安全",
    questions: [
      {
        question: "網上訂購是否安全？",
        answer:
          "網上外賣訂購服務是安全可靠的。我們的網上交易使用安全接層加密技術 Secure Sockets Layer（SSL）。所有個人資料包括您的信用卡號碼、姓名會經過加密，才透過互聯網傳送，防止您的資料在網上傳送時，被未經許可的第三者閱讀。",
      },
      {
        question: "我的信用卡資料和安全代碼會被存儲在網站中嗎？",
        answer:
          "除訂單信息外，您輸入的所有信用卡資料和安全代碼將自動傳送至銀行進行驗證和授權。出於安全目的，我們不會存儲這些資料。",
      },
      {
        question: "什麼是「Visa驗證」，「MasterCard 安全代碼」或「美國運通SafeKey」？是否需要註冊？",
        answer:
          "經過 Visa 驗證的 MasterCard 安全代碼 和 美國運通SafeKey是安全的網上付款服務。可為您的信用卡提供個人密碼，進一步確保只有您可以使用您的信用卡進行網上購物。有些銀行要求在處理交易之前通過 Visa 或 MasterCard 安全代碼驗證您的身份。",
      },
      {
        question: "如何激活「Visa驗證」，「MasterCard 安全代碼」或「美國運通SafeKey」？",
        answer:
          "請向您的 Visa 或 MasterCard 發卡機構的網站了解詳細信息。如果您有美國運通帳戶，您將自動註冊美國運通 SafeKey。",
      },
    ],
  },
  {
    category: "Online Order",
    categoryTC: "線上訂購",
    questions: [
      {
        question: "I am not a sen-ryo member. Can I still order online?",
        answer: "This service is available to sen-ryo member and non-member.",
      },
      {
        question: "I am under 18. Can I still order online?",
        answer: "You need to be at least 18 years old to use this service.",
      },
      {
        question: "Which stores offer online ordering service?",
        answer: "All sen-ryo stores in Hong Kong offer online order Pick-up.",
      },
      {
        question: "What is the operation hours for online ordering?",
        answer:
          "Daily available pickup time is from 11:30am to 10:00pm. Same day order needs to be completed at least 1 hour prior to your planned Pick-up time.",
      },
      {
        question: "What credit cards can I use for payment?",
        answer: "Online Ordering accepts VISA, MasterCard or American Express for payment. ",
      },
      {
        question: "During payment, my credit card did not get approved by the bank. What can I do?",
        answer:
          "You may check your order status under \"Cart\" to confirm whether the payment has been successful. If you have any questions, please contact your card issuing bank directly. ",
      },
      {
        question: "During payment, the screen stays at the payment process and has no response. What can I do?",
        answer: "Please contact your card issuing bank directly.",
      },
      {
        question: "If I do not Pick-up the order, will I still be charged?",
        answer: "Once the order is completed on the website, your credit card will be charged.",
      },
      {
        question: "Can I use sen-ryo’s coupons when making orders online?",
        answer: "sen-ryo member may use your sen-ryo Points for payment, but we do not accept sen-ryo’s coupons.",
      },
      {
        question: "Can I use my sen-ryo Points for payment?",
        answer: "Yes, sen-ryo member can select the amount of points in blocks of 20.",
      },
      {
        question: "I have completed my order but did not receive the confirmation email. What can I do?",
        answer: `Please try one of the following:
        •	 Check the junk mailbox in your email
        •	 Or call sen-ryo Hotline`,
      },
      {
        question: "Is there any additional charges for online ordering?",
        answer: "No, there will be no additional charges.",
      },
      {
        question: "Will I get an official receipt for my order?",
        answer: "Yes, you may ask for an official receipt when you Pick-up your order at the store.",
      },
      {
        question: "Do you provide delivery services for my orders?",
        answer:
          "No, we do not offer delivery service for online orders. You may select one of the sen-ryo stores in Hong Kong to Pick-up your order.",
      },
      {
        question: "How do I check my orders?",
        answer: "Check your email to see if you have received our order confirmation",
      },
    ],
  },
  {
    category: "線上訂購",
    questions: [
      {
        question: "非會員可於此網站進行訂購嗎？",
        answer: "網上訂購提供予會員或非會員使用。",
      },
      {
        question: "未滿18歲人士可使用此網站進行訂購嗎？",
        answer: "外賣自取網上訂購服務只供18歲或以上的顧客使用。",
      },
      {
        question: "哪些分店可提供網上訂購服務？",
        answer: "香港全線千両分店均提供外賣自取訂購服務。",
      },
      {
        question: " 網上外賣自取訂購的服務時間？",
        answer: "每日可外賣自取時間為上午 11:30 至晚上 10:00。當日訂單需要在取餐 1 小時前完成。",
      },
      {
        question: "我可以使用哪些信用卡付款？",
        answer: "您可以使用Visa/Master/Amex信用卡作網上付款。",
      },
      {
        question: "付款時，我的信用卡未獲銀行批准。我可以怎樣做？",
        answer: "您可以在“購物車”下查看訂單狀態，確認支付是否成功。如果您有任何疑問，請直接聯繫您的發卡銀行。",
      },
      {
        question: "在支付過程中停留在支付過程中，沒有任何反應。我可以怎樣做？",
        answer: "請直接聯繫您的發卡銀行。",
      },
      {
        question: "如果我未能取餐，還會被扣費用嗎？",
        answer: "一旦在網上完成訂單，您的信用卡就會被扣款。",
      },
      {
        question: "網上訂購可使用千両的優惠券嗎?",
        answer: "千両會員可以使用您的千両積分進行付款，但我們不接受sen-ryo的優惠券。",
      },
      {
        question: "我可以使用我的千両積分進行付款嗎？",
        answer: "是的，千両會員可以選擇以20為數量單位的積分。",
      },
      {
        question: "完成訂購後未能收到確認電郵？",
        answer: "可查閱電子郵件信箱 (垃圾郵件/濫發郵件) 內是否已經收到訂單確認電郵或致電千両顧客服務熱線",
      },
      {
        question: "網上訂購是否需要額外收費？",
        answer: "不需要額外費用。",
      },
      {
        question: "網上訂購是否有收據？",
        answer: "您可於取餐時向分店職員索取收據。",
      },
      {
        question: "您們會否提供送貨服務？",
        answer: "我們不會為網上訂單提供送貨服務。您可選擇香港其中一間千両分店取餐。",
      },
      {
        question: "如何查看我的訂單？",
        answer: "檢查您的電郵是否已收到我們的訂單確認",
      },
    ],
  },
  {
    category: "Order Pickup",
    categoryTC: "取餐安排",
    questions: [
      {
        question: "How do I Pick-up my order?",
        answer: "Please bring along your order confirmation to the pickup store to Pick-up your order.",
      },
      {
        question: "Can I ask someone else to Pick-up the order for me?",
        answer:
          "Anyone who picks up the orders with a valid pickup order and barcode will be deemed your authorized representative.",
      },
      {
        question: "Can the order be picked up at any of the sen-ryo store?",
        answer: "No, you may only pickup your order at the store you selected on your order.",
      },
      {
        question: "If I missed my order pickup time, can I still Pick-up later?",
        answer:
          "If the order is not being picked up within 4 hours from the selected pickup time specified on the order, the order will be deemed forfeited and no refund will be made.",
      },
      {
        question: "Do I have to print out the order confirmation to Pick-up?",
        answer: "You will have to display the order pickup barcode in order to Pick-up.",
      },
    ],
  },
  {
    category: "取餐安排",
    questions: [
      {
        question: "如何提取訂單？",
        answer: "請攜帶您的訂單確認函前往千両分店取餐。",
      },
      {
        question: "我可以請別人代替我取餐嗎？",
        answer: "任何使用有效的確認訂單取餐的人將被視為您授權代表。",
      },
      {
        question: "訂單可以在任何一間千両分店取餐？",
        answer: "不可以，您只能在訂單中選擇的分店取餐。",
      },
      {
        question: "如果我錯過了訂單取餐時間，我能否稍後前往取餐？",
        answer: "如果訂單上指定的所選取貨時間後 4 小時內仍未有人取餐，該訂單則被視為放棄且不予退款。",
      },
      {
        question: "我需要出示打印的訂單確認才能取餐嗎？",
        answer: "您必須出示訂單取餐條碼才能取餐。",
      },
    ],
  },
  {
    category: "Change Order",
    categoryTC: "更改訂單",
    questions: [
      {
        question: "Can I change my pickup store, pickup date/time or the items in my order?",
        answer: "Order cannot be changed. If you need additional items, please create a new order.",
      },
      {
        question: "Can I cancel my order or ask for a refund?",
        answer: "Once the order is confirmed, the order cannot be cancelled.",
      },
      {
        question: "What happens when the weather condition is bad?",
        answer: "If the stores are still in operation, the order will still be valid.",
      },
    ],
  },
  {
    category: "更改訂單",
    questions: [
      {
        question: "我可以訂單中的食品或已選的取餐日期/分店嗎?",
        answer:
          "確認訂單後將不可取消或取餐日期、時間、取餐分店及訂單內的食物，如需額外加購其他食物/項目，可建立新訂單進行訂購。",
      },
      {
        question: "已確認的訂單可否取消或退款？",
        answer: "所有已確認的訂單都不能取消及退款。",
      },
      {
        question: "惡劣天氣安排? (如九號或以上颱風信號)",
        answer: "如遇上惡劣天氣，若取餐分店如常營業，訂單仍會生效請於到訪前致電分店確認。",
      },
    ],
  },
];

export const membership: Faqs[] = [
  {
    category: "membership",
    questions: [
      {
        question: "How to become a sen-ryo Member?",
        answer:
          "Become a Basic Member for customers who have one-off spending of HK$100 or above upon dine-in, takeaway or online takeaway ordering (excluding third-party takeaway platform), scan the QR code on the receipt of dine-in or takeaway order via sen-ryo Sushi mobile app or access the registration form after online ordering to complete the registration in 7 days. A membership confirmation email will be sent within 24 hours. 180 days validity period for Basic Membership. Basic will be upgraded to Elite with cumulative spending of HK$950 or above within any consecutive 62 days during the validity period of such Basic Membership. For customers who have one-off spending of HK$950 or above will become a Elite Member with 2 years validity of membership.",
      },
      {
        question: "How to become a Prestige Member?",
        answer:
          "Elite will be upgraded to Prestige once the cumulative spending of designated amount has been reached within the validity period of such Elite Membership. For details, please refer to Terms and Conditions of sen-ryo Membership Program.",
      },
      {
        question: "I did not receive confirmation email within 24 hours after membership submission. Why?",
        answer:
          "You may check your mailbox used for membership registration fist, including the junk emails/ spam. For assistance, please click here to contact our Customer Service Department.",
      },
      {
        question: "Can I have more than one sen-ryo Member account?",
        answer: "Each valid mobile phone number and email address can be registered for one Membership only.",
      },
      {
        question: "How to renew membership?",
        answer: `Elite will be renewed for 2 years with designated cumulative spending in the last two months before the expiry of current membership. Prestige will be renewed for 1 year with cumulative spending of designated amount within the validity period of the current membership.
        Membership will be downgraded or expired when member fail to reach the renewal criteria. For details, please refer to Terms and Conditions of sen-ryo Membership Program.
        `,
      },
    ],
  },
  {
    category: "千両會員計劃",
    questions: [
      {
        question: "如何成為千両會員？",
        answer:
          "於堂食、外賣或網上外賣訂餐（不包括第三方外賣平台）一次性消費滿港幣100或以上的顧客，便可利用千両應用程式掃描堂食或外賣訂單收據上的二維碼或填寫註冊表格即可在7天內完成註冊成為百両會員。確認電郵將在 24小時內發送。基本會員有效期為 180天。基本會籍有效期內任何連續62天內累計消費滿港幣950元或以上，即可升級為千両會籍。客戶一次性消費滿港幣$950或以上，即可成為千両會員，會員有效期為2年。",
      },
      {
        question: "如何成為万両會員？",
        answer: "千両會員在有效期內累計消費滿指定金額即可升級為万両會員。詳情請參閱千両會員計劃條款及細則。",
      },
      {
        question: "提交申請後24小時內沒有收到確認電郵？",
        answer: "可查閱電子郵件信箱 (垃圾郵件/濫發郵件) 內是否已經收到會員確認電郵或致電千両顧客服務熱線",
      },
      {
        question: "我可以擁有多個千両會員帳戶嗎？",
        answer: "每個有效的手機號碼和您的電郵只能註冊一個會籍。",
      },
      {
        question: "如何續會？",
        answer: `千両會籍有效期屆滿前兩個月累計指定消費即可續會2年。現有會籍有效期內累計消費滿指定金額，可續享1年尊享。會員未達到續會標準時，會員資格將被降級或失效。詳情請參閱千両會員計劃條款及細則。
        `,
      },
    ],
  },
  {
    category: "privileges",
    questions: [
      {
        question: "What member privileges can I enjoy if I successfully apply for the sen-ryo Membership?",
        answer:
          "Become a Basic Member to enjoy welcome and monthly e-coupons. Upgrade to Elite to enjoy more exclusive privileges including online queuing, points reward as cash, birthday offer, Member Thankful Day discount and more. For details, please refer to sen-ryo Member Privileges.",
      },
      {
        question: "How do I enjoy the Welcome/ Upgrade offers?",
        answer:
          "The e-coupon of Welcome/ Upgrade offers will be automatically sent to member account once the customer reaches the individual membership tier. Welcome offer will not be given to Membership downgraded from Prestige to Elite.",
      },
      {
        question: "Why can’t I enjoy the birthday offer?",
        answer:
          "Birthday offer is applicable for Elite and Prestige Members. If you become a sen-ryo member in your birthday month, you may enjoy the birthday offer in the birthday month of the following year.",
      },
      {
        question: "What is the “sen-ryo Point” used for?",
        answer:
          "Only Elite and Prestige are eligible to earn sen-ryo Points for transactions. For every HK$10 (net spending excluding 10% service charge) you spend with your valid sen-ryo Member account, you will earn 1 sen-ryo Point. Prestige Member can earn extra points during Monday to Friday. Terms apply. Accumulate 10 sen-ryo Points to use as HK$10 in your subsequent purchase. sen-ryo Point can be used in 10-point units.",
      },
      {
        question: "Why am I unable to earn sen-ryo Point? ",
        answer: `You cannot earn sen-ryo Point under the following circumstances:

          •	 If you are unable to present or login to a valid Elite or Prestige account at the time of payment. The transaction cannot be recorded by system.

          •	 If you are restricted by the terms and conditions of specific promotional campaigns.

          •	 The 10% service charge, discounts offers, coupons, purchase or use of gift vouchers and sen-ryo Point used will not be awarded with sen-ryo Point.`,
      },
      {
        question:
          "If I forget to present or login to my sen-ryo Member account at the time of payment, can I still earn sen-ryo Point?",
        answer:
          "Valid sen-ryo Member account must be present or login at the time of payment. sen-ryo Point will not be granted for the transaction and will not be credited at a later time.",
      },
    ],
  },
  {
    category: "會員禮遇",
    questions: [
      {
        question: "如成功申請千両會員可以享受哪些會員優惠？",
        answer:
          "成為百両會員即可享受迎新優惠券和每月電子優惠券。升級至精英會員可享受更多專屬特權，包括在線排隊、積分現金獎勵、生日優惠、會員感恩日折扣等。詳情請參閱千両會員特權。",
      },
      {
        question: "我如何享受迎新/升級優惠？",
        answer:
          "當客戶達到個人會員級別，歡迎/升級優惠的電子優惠券將自動傳送至會員帳戶。會員資格從万両級降為千両時，將不會獲得迎新優惠。",
      },
      {
        question: "為什麼我無法享受生日優惠？",
        answer: "生日優惠只適用於万両會員和万両會員。如果您在生日月份成為會員，您可以在下一年的生日月份享受生日優惠。",
      },
      {
        question: "「千両積分」有什麼用途？",
        answer:
          "只有千両和万両會員才有資格通過交易賺取千両積分。憑有效會員賬戶每消費港幣10元（消費淨額，不含10%服務費），即可賺取1積分。万両會員可在周一至週五賺取額外積分，條款適用。累積10點千両積分即可在日後購買時用作港幣$10。千両積分需要以 10 點為單位使用。",
      },
      {
        question: "為什麼我無法賺取千両積分？",
        answer: `在以下情況下，您將無法賺取千両積分：

          •	 如果您在付款時無法出示或登入有效的千両或万両帳戶，系統將無法記錄該交易。
          •	 受到特定促銷活動的條款和條件的限制。
          •	 10%服務費、折扣優惠、優惠券、購買或使用禮券及千両積分將不會獲得千両積分。`,
      },
      {
        question: "如果我在付款時忘記出示或登入我的千両會員帳戶，我還能賺取千両積分嗎？",
        answer: "付款時必須出示或登入有效的千両會員帳戶。否則交易不會給予千両積分。",
      },
    ],
  },
  {
    category: "member account",
    questions: [
      {
        question: "How do I check my sen-ryo Member tier, cumulative spending amount and expiry date of membership?",
        answer:
          "You may view membership status after login to your member account via sen-ryo Sushi website or mobile app.",
      },
      {
        question: "How do I earn sen-ryo Point?",
        answer:
          "Elite and Prestige are eligible to earn sen-ryo Point upon dine-in, takeaway and online takeaway ordering (excluding third-party takeaway platform). For every HK$10 (net spending excluding 10% service charge) you spend, you will earn 1 sen-ryo Point. Decimal places and spending less than HK$10 will not be counted (e.g. receive 12 sen-ryo Points for net spending excluding 10% service charge of HK$125.50). Prestige Member can earn extra points during Monday to Friday. Terms apply.",
      },
      {
        question: "When will my cumulative spending and sen-ryo Point balance be updated after each transaction?",
        answer:
          "Your cumulative spending will be updated instantly and sen-ryo Point redeemed will be deducted from your point balance accordingly after each transaction. sen-ryo Point earned in each transaction will be credited to your account within 24 hours.",
      },
      {
        question: "How long is the validity period of my sen-ryo Point?",
        answer: `•	Elite: Points earned in the 1st year are valid till the 13th month from the start of the current Membership year; Points earned in the 2nd year are valid till the expiration of the current Membership year.
          •	Prestige: Points earned during the membership period are valid till the expiration of the current Membership year.
          •	Unused Points will be void and cannot be brought forward to the new membership year.`,
      },
      {
        question: "How do I check my sen-ryo Point balance?",
        answer: `Elite and Prestige members may check their sen-ryo Point balance via the following methods:
          • The receipt for each transaction will clearly list your sen-ryo Point balance.
          • Login to the Member Area of sen-ryo Sushi website or mobile app.`,
      },
      {
        question: "How can I earn or use sen-ryo Point if I cannot login to the sen-ryo Member account via mobile app?",
        answer:
          "You may login to the Member Area at sen-ryo Sushi website, and present the QR code to cashier, you will then be able to earn and use sen-ryo Points for the transaction. ",
      },
      {
        question: "I have reached the renewal criteria. Why hasn’t my membership expiry date/member tier been changed?",
        answer:
          "The new membership expiry date of Elite and Prestige will be updated when new membership period starts. For Prestige member upgraded from Elite, the member tier and new membership expiry date will be effective from the next day after renewal criteria has been reached.",
      },
      {
        question:
          "May I combine the cumulative spending across different member accounts to reach a new membership tier?",
        answer:
          "No. The cumulative spending is calculated based on each individual account. You cannot transfer the spending from different member account. ",
      },
      {
        question: "How do I change my login password, personal information or direct marketing communication channel?",
        answer:
          "You may update your personal setting by Login to the Member Area via sen-ryo Sushi website or mobile app (except month of birth and year of birth). ",
      },
      {
        question: " What can I do if I forget my password?",
        answer:
          "You may simply click \"Forgot password\" on the member login page of sen-ryo Sushi website or mobile app and follow by inputting your your 10-digit sen-ryo member number or registered email address. A password reset link will be sent to your registered email address shortly.",
      },
    ],
  },
  {
    category: "會員帳戶",
    questions: [
      {
        question: "如何查看我的千両會員等級、累計消費金額以及會員有效期？",
        answer: "您可以通過千両網站或應用程式登入會員帳戶後查看會員狀態。",
      },
      {
        question: "如何賺取千両積分？",
        answer:
          "只限千両和万両會員可於堂食、外賣和網上訂單（不包括第三方外賣平台）賺取千両積分。每消費港幣$10（消費淨額，不含 10%服務費） ，即可賺取1點千兩積分。小數位及消費額少於港幣 10 元將不計算在內（例如：扣除 10% 服務費港幣 125.50 元的淨消費可獲 12 點千両積分）。万両會員可在周一至週五賺取額外積分，條款適用。",
      },
      {
        question: "我的累計消費和千両積分餘額在每次交易後何時會更新？",
        answer:
          "您的累計消費將立即更新，並且在每次交易後兌換的千両積分將從您的積分餘額中扣除。每筆交易賺取的千両積分將在24小時內傳送至入您的帳戶。",
      },
      {
        question: "我的千両積分的有效期多久？",
        answer: `•千両會員：在第一年所獲得的積分有效期至會員年度開始後的第13個月；第二年獲得的積分有效期至會員年度的到期日。
        •万両會員：會員期內賺取的積分有效期至會員年度的到期日。
        •未使用的積分將作廢，並且不能轉入新的會員年度。`,
      },
      {
        question: "如何查看我的千両積分餘額？",
        answer: `千両會員和万両會員可以通過以下方法查看積分餘額：
        • 每筆交易的收據都會清楚地列出您的千両積分餘額。
        • 登入千両網站或手機應用程式的會員專區。`,
      },
      {
        question: "如果我無法通過手機應用程式登入千両會員帳戶，如何賺取或使用千両積分？",
        answer: "您可以登入千両網站的會員專區，向收銀員出示二維碼，即可賺取並使用千両積分進行交易。",
      },
      {
        question: "我已達到續會要求，為什麼我的會員資格在到期日期或會員等級沒有被？",
        answer:
          "千両會員和万両會員的新會員資格將會在到期日期更新。對於從千両會員升級為万両會員的會員，其會員等級和新會員有效期將於達到續會要求的翌日起生效。",
      },
      {
        question: "我可以合併不同會員賬戶的累計消費來達到新的會員等級嗎？",
        answer: "不可以。累計消費是按每個個人賬戶計算的，您不能從不同的會員賬戶轉移。",
      },
      {
        question: "如何我的登入密碼、個人信息或推銷接收途徑？",
        answer: "您可以於千両網站或應用程式登入會員專區來更新您的個人設置（出生月份和年份除外）。",
      },
      {
        question: "忘記了登入密碼？",
        answer:
          "您只需在千両網站或手機應用程式的會員登入頁面點擊“忘記密碼”，然後輸入您的10位數字的千両會員號碼或註冊電郵。密碼重置鏈接將很快傳送到您註冊的電郵。",
      },
    ],
  },
];
