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
				.select("*");
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
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: updatedProfile } = await supabase
				.from("profiles")
				.update({
					first_name: data.firstName,
					second_name: data.secondName,
					email: data.email,
					phone: data.phone,
					group_id: data.groupId,
					avatar_url: data.avatarImage
				})
				.eq("id", data.id)
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return updatedProfile;
		},
		async onSuccess(_, { id }) {
			await queryClient.invalidateQueries({ queryKey: ["profiles"] });
			await queryClient.invalidateQueries({
				queryKey: ["profiles", id],
			});
		},
		onError(error) {
			console.log("Mutation error:", error);
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
