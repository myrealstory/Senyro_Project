import { ENDPOINTS } from "@/constants/endpoints";
import { FetchFailResponse } from "@/types/commonTyps";
import { fetchRequestSeverSide } from "@/utils/serverUtils";
import { VerifyNewUserEmailRequestType, VerifyNewUserEmailResponseType } from "@/types/api/apiTypes";

export const verifyNewUserEmail = async ({ lang, session }: VerifyNewUserEmailRequestType) => {
  return fetchRequestSeverSide<VerifyNewUserEmailResponseType>({
    url: ENDPOINTS.VERIFY_NEW_USER_EMAIL,
    language: lang,
    options: {
      method: "POST",
    },
    body: {
      sessionId: session,
    },
  })
  .catch((error: FetchFailResponse) => {
    console.error(error);
    return error;
  });
};