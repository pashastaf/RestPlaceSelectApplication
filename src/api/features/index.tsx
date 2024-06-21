import {
	UseQueryResult,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export interface FeaturesByPlacesId {
  id: number;
  features_id: number;
  rest_places_id: number;
  features: {
    id: number;
    title: number;
    color: string;
  }
}

export interface FeaturesByDestination {
  id: number;
  features_id: number;
  destinations_id: number;
  features: {
    id: number;
    title: string;
    color: string;
  };
}

export const useFeaturesForPlaces = () => {
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

export const useFeaturesByPlacesId = (id: number) => {
	return useQuery({
		queryKey: ["places_features", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("places_features")
				.select("*, features(id, title, color)")
				.eq("rest_places_id", id);

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
				.eq('features_type_id', 1);
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
				.select("*, features(id, title, color)")
				.eq("destinations_id", id);

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useInsertFeaturesByRestPlace = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: newServicesByOrder } = await supabase
				.from("places_features")
				.insert({
					rest_places_id: data.restPlaceId,
					features_id: data.featuresId,
				})
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return newServicesByOrder;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ["places_features"],
			});
		},
		onError(error) {
			console.log(error);
		},
	});
};

export const useDeleteFeaturesByRestPlace = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(id: number) {
			const { error } = await supabase
				.from("places_features")
				.delete()
				.eq("rest_places_id", id);

			if (error) {
				throw new Error(error.message);
			}
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ["places_features"] });
		},
		onError: (error) => {
			console.error("Error deleting order:", error);
		},
	});
};

export const useInsertFeaturesByDestination = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: newServicesByOrder } = await supabase
				.from("destinations_features")
				.insert({
					destinations_id: data.destinationsId,
					features_id: data.featuresId,
				})
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return newServicesByOrder;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ["destinations_features"],
			});
		},
		onError(error) {
			console.log(error);
		},
	});
};

export const useDeleteFeaturesByDestination = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(id: number) {
			const { error } = await supabase
				.from("destinations_features")
				.delete()
				.eq("destinations_id", id);

			if (error) {
				throw new Error(error.message);
			}
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ["destinations_features"] });
		},
		onError: (error) => {
			console.error("Error deleting order:", error);
		},
	});
};