import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export const useDestinationList = () => {
	return useQuery({
		queryKey: ["destinations"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("destinations")
				.select("*");
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useDestination = (id: number) => {
	return useQuery({
		queryKey: ["destinations", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("destinations")
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

export const useInsertDestination = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: newDestination } = await supabase
				.from("destinations")
				.insert({
					title: data.title,
					countries_id: data.countryId,
					is_deleted: 0,
				})
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return newDestination;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ["destinations"],
			});
		},
		onError(error) {
			console.log(error);
		},
	});
};

export const useUpdateDestination = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: updatedDestination } = await supabase
				.from("destinations")
				.update({
					title: data.title,
					countries_id: data.contryId,
					is_deleted: 0,
				})
				.eq("id", data.id)
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return updatedDestination;
		},
		async onSuccess(_, { id }) {
			await queryClient.invalidateQueries({
				queryKey: ["destinations"],
			});
			await queryClient.invalidateQueries({
				queryKey: ["destinations", id],
			});
		},
		onError(error) {
			console.log("Mutation error:", error);
		},
	});
};

export const useDeleteDestination = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(id: number) {
			const { error } = await supabase
				.from("destinations")
				.delete()
				.eq("id", id);

			if (error) {
				throw new Error(error.message);
			}
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ["destinations"],
			});
		},
	});
};

export const useCountryList = () => {
	return useQuery({
		queryKey: ["countries"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("countries")
				.select("*");
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useFeaturesForDestinations = () => {
	return useQuery({
		queryKey: ["features"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("features")
				.select("*")
				.eq('features_type_id', 2);
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useFeaturesByDestinationId = (id: number) => {
	return useQuery({
		queryKey: ["destinations_features", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("destinations_features")
				.select("*, features(id, title)")
				.eq("destinations_id", id);

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};
