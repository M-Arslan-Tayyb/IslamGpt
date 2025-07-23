import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { chat_endpoints } from "../apiEndPoints";
import { apiConnector } from "../apiConnector";
import { useSelector } from "react-redux";

const {
  GENERATE_AI,
  GET_LISTING,
  GET_HISTORY,
  DELETE_SESSION,
  GENERATE_AUDIO,
} = chat_endpoints;

export function useGenerateAIMutation() {
  const { user } = useSelector((state) => state.profile);

  const mutation = useMutation({
    mutationFn: async ({ query, sessionId }) => {
      if (!user?.user_id) throw new Error("User ID is required");

      const payload = {
        query,
        user_id: String(user.user_id),
        session_id: String(sessionId),
      };

      const response = await apiConnector("POST", GENERATE_AI, payload);
      if (!response.data.succeeded) {
        throw new Error(response.data.message || "Failed to generate response");
      }

      return {
        ...response.data,
        session_id: sessionId,
      };
    },
    onMutate: () => {
      // Optional: toast.loading("Generating response...", { id: "ai-response" })
    },
    onSuccess: (data) => {
      console.log("AI Response successful:", data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate response", {
        id: "ai-response",
      });
    },
  });

  return mutation;
}

export function useGenerateAudioMutation() {
  return useMutation({
    mutationFn: async (text) => {
      const response = await apiConnector(
        "POST",
        GENERATE_AUDIO,
        { text },
        { Accept: "audio/mpeg" },
        null,
        "blob"
      );

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    },
    onError: (err) => {
      console.error("Audio Generation Error:", err);
      toast.error("Failed to generate audio");
    },
  });
}

export function useGetListingMutation() {
  const { user } = useSelector((state) => state.profile);

  return useQuery({
    queryKey: ["chatSessions", user?.user_id],
    queryFn: async () => {
      if (!user?.user_id) {
        throw new Error("User ID is required");
      }
      const url = `${GET_LISTING}?user_id=${user.user_id}`;
      console.log("Fetching chat listings from:", url);

      const response = await apiConnector("GET", url);

      // Check if the response is successful
      if (response.data && response.data.succeeded !== undefined) {
        if (!response.data.succeeded) {
          throw new Error(
            response.data.message || "Failed to get chat listings"
          );
        }
        return response.data;
      } else if (response.data && response.data.data) {
        // If the API doesn't return a 'succeeded' field but has data, consider it successful
        return {
          succeeded: true,
          data: response.data.data,
          message:
            response.data.message || "Chat listings fetched successfully",
        };
      } else {
        throw new Error("Invalid response format");
      }
    },
    enabled: !!user?.user_id,
    onError: (error) => {
      console.error("GET LISTING ERROR:", error);
      toast.error(error.message || "Failed to get chat listings");
    },
  });
}

export function useGetHistoryMutation() {
  const { user } = useSelector((state) => state.profile);

  return useMutation({
    mutationFn: async (sessionId) => {
      if (!user?.user_id) {
        throw new Error("User ID is required");
      }
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const url = `${GET_HISTORY}?user_id=${user.user_id}&session_id=${sessionId}`;
      console.log("Fetching chat history from:", url);

      const response = await apiConnector("GET", url);

      // Check if the response is successful
      if (response.data && response.data.succeeded !== undefined) {
        if (!response.data.succeeded) {
          throw new Error(
            response.data.message || "Failed to get chat history"
          );
        }
        return response.data;
      } else {
        throw new Error("Invalid response format");
      }
    },
    onMutate: () => {
      toast.dismiss();
    },
    onSuccess: (data) => {
      console.log("History Response:", data);
      toast.dismiss();
    },
    onError: (error) => {
      console.error("GET HISTORY ERROR:", error);
      toast.error(error.message || "Failed to get chat history");
    },
  });
}

export function useDeleteSessionMutation() {
  const { user } = useSelector((state) => state.profile);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ session_id }) => {
      if (!user?.user_id) {
        throw new Error("User ID is required");
      }

      const payload = { session_id: String(session_id) };
      const response = await apiConnector("POST", DELETE_SESSION, payload);

      if (!response?.data?.succeeded) {
        throw new Error(response?.data?.message || "Failed to delete session");
      }

      return response.data;
    },
    onSuccess: (_, { session_id }) => {
      toast.success("Session deleted successfully");
      // Invalidate or refetch the session list
      queryClient.invalidateQueries(["chat-history"]);
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting session");
    },
  });
}
