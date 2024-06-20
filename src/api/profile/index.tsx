import {
	UseQueryResult,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export const useProfileList = () => {
	return useQuery({
		queryKey: ["profiles"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("*, profiles_group(title)");
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useProfile = (id: number) => {
	return useQuery({
		queryKey: ["profiles", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("*, profiles_group(title)")
				.eq("id", id)
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useProfileByGroup = (groupId: number) => {
	return useQuery({
		queryKey: ["profiles", { groupId }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("group_id", groupId);
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};
