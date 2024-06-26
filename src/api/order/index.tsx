import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export const useOrderList = () => {
	return useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("orders")
				.select("*,orders_status(title)");
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useOrderListById = (id: number) => {
	return useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("orders")
				.select("*,orders_status(title)")
				.eq('profiles_id', id);
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};


export const useOrder = (id: number) => {
	return useQuery({
		queryKey: ["orders", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("orders")
				.select("*,orders_status(title)")
				.eq("id", id)
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useInsertOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: newOrder } = await supabase
				.from("orders")
				.insert({
					profiles_id: data.profileId,
					consultants_id: data.consultantId,
					sale_date: data.currentDate,
					total_cost: data.totalCost,
					status_id: 1,
				})
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return newOrder;
		},

		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError(error) {
			console.log(error);
		},
	});
};

export const useUpdateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: updatedOrder } = await supabase
				.from("orders")
				.update({
					profiles_id: data.profileId,
					consultants_id: data.consultantId,
					total_cost: data.totalCost,
					status_id: data.status_id
				})
				.eq("id", data.id)
				.select()
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return updatedOrder;
		},
		async onSuccess(_, { id }) {
			await queryClient.invalidateQueries({ queryKey: ["orders"] });
			await queryClient.invalidateQueries({
				queryKey: ["orders", id],
			});
		},
		onError(error) {
			console.log("Mutation error:", error);
		},
	});
};

export const useDeleteOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(id: number) {
			const { error } = await supabase
				.from("orders")
				.delete()
				.eq("id", id);

			if (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (error) => {
			console.error("Error deleting order:", error);
		},
	});
};

export const useServiceList = () => {
	return useQuery({
		queryKey: ["services"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("services")
				.select("*");
			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};

export const useInsertServiceByOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(data: any) {
			const { error, data: newServicesByOrder } = await supabase
				.from("services_by_order")
				.insert({
					orders_id: data.orderId,
					services_id: data.serviceId,
				})
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return newServicesByOrder;
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ["services_by_order"],
			});
		},
		onError(error) {
			console.log(error);
		},
	});
};

export const useDeleteServiceByOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		async mutationFn(id: number) {
			const { error } = await supabase
				.from("services_by_order")
				.delete()
				.eq("orders_id", id);

			if (error) {
				throw new Error(error.message);
			}
		},
		async onSuccess() {
			await queryClient.invalidateQueries({ queryKey: ["services_by_order"] });
		},
		onError: (error) => {
			console.error("Error deleting order:", error);
		},
	});
};



export const useServicesByOrder = (id: number) => {
	return useQuery({
		queryKey: ["services_by_order", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("services_by_order")
				.select("*, services(id, title)")
				.eq("orders_id", id);

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};
