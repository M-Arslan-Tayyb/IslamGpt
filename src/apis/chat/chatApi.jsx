import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { chat_endpoints } from "../apiEndPoints";
import { apiConnector } from "../apiConnector";
import { useSelector } from "react-redux";

const { GENERATE_AI } = chat_endpoints;

// console.log("userid in chatapi: ", user);

export function useGenerateAIMutation() {
  const { user } = useSelector((state) => state.profile);
  return useMutation({
    mutationFn: async (query) => {
      const payload = {
        query,
        user_id: toString(user?.user_id),
        session_id: crypto.randomUUID(),
      };
      const response = await apiConnector("POST", GENERATE_AI, payload);
      return response.data;
    },
    onMutate: () => {

      toast.dismiss(); // Dismiss any existing toasts
    },
    onSuccess: (data) => {
      console.log("API Response:", data);
      toast.dismiss();

      if (data.success === false) {
        throw new Error(data.message || "Failed to generate response");
      }
      return data;
    },
    onError: (error) => {
      toast.dismiss();
      console.error("GENERATE AI ERROR:", error);
      toast.error(error.message || "Failed to generate response");
    },
  });
}
