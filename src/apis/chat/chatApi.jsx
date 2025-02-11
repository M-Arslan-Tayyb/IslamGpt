import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { chat_endpoints } from "../apiEndPoints";
import { apiConnector } from "../apiConnector";

const { GENERATE_AI } = chat_endpoints;

export function useGenerateAIMutation() {
  return useMutation({
    mutationFn: (query) => {
      const payload = {
        query,
        user_id: "1", // Replace with actual user ID from your auth system
        session_id: crypto.randomUUID(), // Random session_id
      };
      return apiConnector("POST", GENERATE_AI, payload);
    },
    onMutate: () => {
      toast.loading("Generating response...");
    },
    onSuccess: (response) => {
      toast.dismiss();
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to generate response");
      }
      toast.success("Response generated successfully");
      return response.data;
    },
    onError: (error) => {
      toast.dismiss();
      console.error("GENERATE AI ERROR:", error);
      toast.error(error.message || "Failed to generate response");
    },
  });
}
