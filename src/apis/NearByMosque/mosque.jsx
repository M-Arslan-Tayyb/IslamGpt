import { toast } from "react-hot-toast";
import { NEARBY_MOSQUES_endpoints } from "../apiEndPoints";
import { apiConnector } from "../apiConnector";
import { useMutation } from "@tanstack/react-query";

const { NEARBY_MOSQUES_API } = NEARBY_MOSQUES_endpoints;

export function useNearbyMosquesMutation() {
  return useMutation({
    mutationFn: ({ latitude, longitude }) => {
      return apiConnector("POST", NEARBY_MOSQUES_API, { latitude, longitude });
    },
    onMutate: () => {
      toast.loading("Finding nearby mosques...");
    },
    onSuccess: (response) => {
      toast.dismiss();
      if (response.data.succeeded) {
        toast.success(
          response.data.message || "Nearby mosques found successfully"
        );
      } else {
        toast.error(response.data.message || "Failed to find nearby mosques");
      }
    },
    onError: (error) => {
      toast.dismiss();
      console.log("NEARBY MOSQUES API ERROR:", error);
      console.log(error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message || "Failed to find nearby mosques"
      );
    },
  });
}
