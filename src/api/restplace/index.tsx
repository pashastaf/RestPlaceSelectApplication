import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export const useRestPlaceList = () => {
	return useQuery({
		queryKey: ["rest_places"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("rest_places")
				.select("*");
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useRestPlacesByDestinationId = (
	destinationId: number,
) => {
	return useQuery({
		queryKey: ["rest_places", { destinationId }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("rest_places")
				.select("*")
				.eq("destinations_id", destinationId);
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useRestPlace = (id: number) => {
	return useQuery({
		queryKey: ["rest_places", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("rest_places")
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

export const useInsertRestPlace = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: newRestPlace } = await supabase
				.from("rest_places")
				.insert({
					title: data.title,
					destinations_id: data.destinationId,
					is_deleted: 0,
				})
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return newRestPlace;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ["rest_places"],
			});
		},
		onError(error) {
			console.log(error);
		},
	});
};

export const useUpdateRestPlace = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: updatedRestPlace } = await supabase
				.from("rest_places")
				.update({
					title: data.title,
					destinations_id: data.destinationId,
					is_deleted: 0,
				})
				.eq("id", data.id)
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return updatedRestPlace;
		},
		async onSuccess(_, { id }) {
			await queryClient.invalidateQueries({
				queryKey: ["rest_places"],
			});
			await queryClient.invalidateQueries({
				queryKey: ["rest_places", id],
			});
		},
		onError(error) {
			console.log("Mutation error:", error);
		},
	});
};

export const useDeleteRestPlace = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(id: number) {
			const { error } = await supabase
				.from("rest_places")
				.delete()
				.eq("id", id);

			if (error) {
				throw new Error(error.message);
			}
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ["rest_places"],
			});
		},
	});
};

export const useFeatures = () => {
	return useQuery({
		queryKey: ["features_preferences"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("features_preferences")
				.select("*");
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};
