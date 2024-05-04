import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export const useOrderPlacesList = () => {
	return useQuery({
		queryKey: ["orders_places"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders_places").select("*");
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};
