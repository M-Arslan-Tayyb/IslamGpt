import { toast } from "react-hot-toast";
import { dashboard_endpoints } from "../apiEndPoints";
import { apiConnector } from "../apiConnector";
import { useQuery } from "@tanstack/react-query";

const { AYAH_HADITH_API } = dashboard_endpoints;

export function useDailyContent() {
    return useQuery({
        queryKey: ['dailyContent'],
        queryFn: async () => {
            try {
                const response = await apiConnector('GET', AYAH_HADITH_API);
                if (!response.data.succeeded) {
                    throw new Error(response.data.message || 'Failed to fetch daily content');
                }
                return response.data;
            } catch (error) {
                toast.error(error.message || 'Failed to fetch daily content');
                throw error;
            }
        },
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    });
}