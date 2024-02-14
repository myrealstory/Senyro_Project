import { NextResponse } from "next/server";
import { getCategoryApi } from "./getCategoryApi";
import { ENDPOINTS } from "@/constants/endpoints";
import { getProductApi } from "./getProductApi";

// https://nextjs.org/docs/app/building-your-application/routing/router-handlers
// https://nextjs.org/docs/app/api-reference/file-conventions/route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  searchParams.getAll("*");

  const endpoints = "";
  const lang = "en";

  let promise = new Promise((resolve) => resolve(""));
  switch(endpoints) {
    case ENDPOINTS.GET_CATEGORIES:
      promise = getCategoryApi({lang});
      break;
    case ENDPOINTS.GET_PRODUCTS:
      promise = getProductApi({lang});
    default:
      break;
  }

  return promise
  .then(result => {
    return NextResponse.json({
      status: 200,
      data: result,
    });
  })
  .catch(error => {
    return NextResponse.json({
      status: 400,
      error,
    });
  });
}
