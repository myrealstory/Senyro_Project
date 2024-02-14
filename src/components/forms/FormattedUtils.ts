import { LocaleKeysType } from "@/app/i18n";

interface ReFormattedCardNumType {
  cardNum: string | undefined;
  type: "FourAsterisks" | "FormattedCardNum";
}

// Usage: "2024-10-31" => "31/20/2024"

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
};

// Usage : "2023-11-01" => "01/11"
export const formattedDateForOnlyDateAndMonth = (dateString: string) => {
  const date = new Date(dateString);
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  day = day.length === 1 ? "0" + day : day;
  month = month.length === 1 ? "0" + month : month;
  return `${day}/${month}`;
};

// Usage: "2024-10-31" => "2024/10/31"
export const formatDateToISO = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};

export const formatDateToISOWithSlash = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
};

// Usage:  "2023/05/03 15:30" => "2023 May"
export const formattedDate = (time: string) => {
  const date = new Date(time);
  const formattedDate = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(date).split(" ");
  const finalResult = `${formattedDate[0]} ${formattedDate[1]}`;
  return finalResult;
};

export function convertDateFormat(dateTimeStr: string) {
  return dateTimeStr.replace(/-/g, "/");
}

// Usage: "2023/05" => "May 2023"

export const formattedMonthToBeFirst = (str: string) => {
  const [year, month] = str?.split("/");
  const formattedDate = `${month} ${year}`;
  return formattedDate;
};

// Usage: 2021-08-01T00:00:00.000Z => "01/08/2021"

export const formattedISODateTime = (data: string, time?: boolean) => {
  const date = new Date(data);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const timer = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return time ? `${day}/${month}/${year} ${timer}` : `${day}/${month}/${year}`;
};

type monthMappingType = {
  [key: string]: string;
};

// '1903/Jun' => [`1903`, `06`]
export const convertCustomDateFormat = (inputDate: string): string[] => {
  const [year, month] = inputDate.split("/");
  const monthAbbreviations: monthMappingType = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  if (isNaN(Number(year)) || !monthAbbreviations[month]) {
    throw new Error("Invalid date format");
  }

  const normalizedMonth = monthAbbreviations[month];
  return [`${year}`, `${normalizedMonth}`];
};

export const getLastDayOfMonth = ([yearStr, monthStr]: [string, string]): string => {
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    throw new Error("Invalid input");
  }

  const lastDay = new Date(year, month, 0); // Setting day to 0 gives the last day of the previous month
  const formattedYear = lastDay.getFullYear();
  const formattedMonth = (lastDay.getMonth() + 1).toString().padStart(2, "0");
  const formattedDay = lastDay.getDate().toString().padStart(2, "0");

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
};

export const reFormattedCardNum = ({ cardNum, type }: ReFormattedCardNumType) => {
  switch (type) {
    // Usage "FourAsterisks": ****4334
    case "FourAsterisks": {
      if (cardNum !== undefined) return "****" + cardNum.slice(-4);
      break;
    }
    // Usage "formattedCardNum": 1234 34** **** 4334
    case "FormattedCardNum": {
      const firstFourCharacters = cardNum !== undefined && cardNum.slice(0, 4);
      const middleCharacters = cardNum !== undefined && cardNum.slice(4, 6);
      const lastFourCharacters = cardNum !== undefined && cardNum.slice(-4);
      return `${firstFourCharacters} ${middleCharacters}** **** ${lastFourCharacters}`;
      break;
    }
  }
};

// Usage: Hong Kong Island => hongKongIsland
export const toCamelCase = (str: string) => {
  const words = str.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (i === 0) {
      words[i] = words[i].toLowerCase();
    } else {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
    }
  }

  return words.join("");
};

// Usage: hongKongIsland => Hong Kong Island
export const toTitleCase = (str: string) => {
  // 在每個大寫字母之前插入一個空格，然後將整個字符串分割成單詞
  const words = str.replace(/([A-Z])/g, " $1").split(" ");

  // 遍歷每個單詞，將首字母變為大寫
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  // 將單詞連接回字符串
  return words.join(" ");
};

// Usage: 2024-01-31 => en: 01-24 tc: 2024年1月
export const formatDateBasedOnLang = (lang: LocaleKeysType, dateInput: string) => {
  const date = new Date(dateInput);
  let formattedDate;

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  if (lang === "en") {
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
    const year = date.getFullYear().toString().slice(-2);
    formattedDate = `${month}-${year}`;
  } else if (lang === "tc") {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    formattedDate = `${year}年${month}月`;
  } else {
    return "Invalid language";
  }

  return formattedDate;
};
