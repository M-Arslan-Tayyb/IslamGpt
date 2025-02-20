import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast"; // Note: it's a default import for react-hot-toast
import { chat_endpoints } from "../apiEndPoints";
import { apiConnector } from "../apiConnector";

const { GENERATE_AI } = chat_endpoints;

export function useGenerateAIMutation() {
  return useMutation({
    mutationFn: async (query) => {
      const payload = {
        query,
        user_id: "1",
        session_id: crypto.randomUUID(),
      };
      const response = await apiConnector("POST", GENERATE_AI, payload);
      return response.data;
    },
    onMutate: () => {
      console.log("Mutation started");
      toast.dismiss(); // Dismiss any existing toasts
      // toast.loading("Generating response...");
    },
    onSuccess: (data) => {
      console.log("API Response:", data);
      toast.dismiss();

      if (data.success === false) {
        throw new Error(data.message || "Failed to generate response");
      }

      // toast.success("Response generated successfully");
      return data;
    },
    onError: (error) => {
      toast.dismiss();
      console.error("GENERATE AI ERROR:", error);
      toast.error(error.message || "Failed to generate response");
    },
  });
}
