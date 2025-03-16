import { useMutation, useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { chat_endpoints } from "../apiEndPoints"
import { apiConnector } from "../apiConnector"
import { useSelector } from "react-redux"

const { GENERATE_AI, GET_LISTING, GET_HISTORY } = chat_endpoints

export function useGenerateAIMutation() {
  const { user } = useSelector((state) => state.profile)

  return useMutation({
    mutationFn: async ({ query, sessionId }) => {
      if (!user?.user_id) {
        throw new Error("User ID is required")
      }

      // Use the provided sessionId or generate a new one if not provided
      // This should only happen for the first message in a new chat
      const actualSessionId = sessionId || crypto.randomUUID()

      console.log("API using session ID:", actualSessionId)

      const payload = {
        query,
        user_id: String(user.user_id),
        // session_id: actualSessionId,
        session_id: "77777777",

      }

      console.log("Sending payload to generate AI:", payload)

      const response = await apiConnector("POST", GENERATE_AI, payload)
      console.log(response)

      // Check if the response indicates an error
      if (!response.data.succeeded) {
        console.error("API returned error:", response.data)
        throw new Error(response.data.message || "Failed to generate response")
      }

      console.log("API returned success:", response.data)

      // Return the session_id along with the response data
      return {
        ...response.data,
        session_id: actualSessionId,
      }
    },
    onMutate: () => {
      // Show a loading toast that can be dismissed later
      toast.loading("Generating response...", { id: "ai-response" })
    },
    onSuccess: (data) => {
      console.log("AI Response successful:", data)
      // Dismiss the loading toast and show success
      toast.success("Response generated successfully", { id: "ai-response" })
    },
    onError: (error) => {
      console.error("GENERATE AI ERROR:", error)
      // Dismiss the loading toast and show error
      toast.error(error.message || "Failed to generate response", { id: "ai-response" })
    },
  })
}

export function useGetListingMutation() {
  const { user } = useSelector((state) => state.profile)

  return useQuery({
    queryKey: ["chatSessions", user?.user_id],
    queryFn: async () => {
      if (!user?.user_id) {
        throw new Error("User ID is required")
      }
      const url = `${GET_LISTING}?user_id=${user.user_id}`
      console.log("Fetching chat listings from:", url)

      const response = await apiConnector("GET", url)

      // Check if the response is successful
      if (response.data && response.data.succeeded !== undefined) {
        if (!response.data.succeeded) {
          throw new Error(response.data.message || "Failed to get chat listings")
        }
        return response.data
      } else if (response.data && response.data.data) {
        // If the API doesn't return a 'succeeded' field but has data, consider it successful
        return {
          succeeded: true,
          data: response.data.data,
          message: response.data.message || "Chat listings fetched successfully",
        }
      } else {
        throw new Error("Invalid response format")
      }
    },
    enabled: !!user?.user_id,
    onError: (error) => {
      console.error("GET LISTING ERROR:", error)
      toast.error(error.message || "Failed to get chat listings")
    },
  })
}

export function useGetHistoryMutation() {
  const { user } = useSelector((state) => state.profile)

  return useMutation({
    mutationFn: async (sessionId) => {
      if (!user?.user_id) {
        throw new Error("User ID is required")
      }
      if (!sessionId) {
        throw new Error("Session ID is required")
      }

      const url = `${GET_HISTORY}?user_id=${user.user_id}&session_id=${sessionId}`
      console.log("Fetching chat history from:", url)

      const response = await apiConnector("GET", url)

      // Check if the response is successful
      if (response.data && response.data.succeeded !== undefined) {
        if (!response.data.succeeded) {
          throw new Error(response.data.message || "Failed to get chat history")
        }
        return response.data
      } else {
        throw new Error("Invalid response format")
      }
    },
    onMutate: () => {
      toast.dismiss()
    },
    onSuccess: (data) => {
      console.log("History Response:", data)
      toast.dismiss()
    },
    onError: (error) => {
      console.error("GET HISTORY ERROR:", error)
      toast.error(error.message || "Failed to get chat history")
    },
  })
}

