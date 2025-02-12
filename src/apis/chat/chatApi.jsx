import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
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
      return response;
    },
    onMutate: () => {
      //   toast.loading("Generating response...");
    },
    onSuccess: (response) => {
      console.log("API Response:", response.data);
      toast.dismiss();

      if (response.data.success === false) {
        // Explicitly check for false
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
