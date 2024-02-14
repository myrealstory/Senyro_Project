import { ENDPOINTS } from "@/constants/endpoints";
import { FetchFailResponse } from "@/types/commonTyps";
import { fetchRequestSeverSide } from "@/utils/serverUtils";

export const getMaintenanceStatus = async () => {
  return await fetchRequestSeverSide({
    url: ENDPOINTS.GET_MAINTENANCE_STATUS,
    language: "tc",
    options: {
      method: "GET",
      revalidate: 0,
    }
  })
  .then(result => {
    return result;
  })
  .catch((error: FetchFailResponse) => {
    console.log("[Error] getMaintenanceStatus: ", typeof error === "string" ? error : JSON.stringify(error));
    return error;
  });
};