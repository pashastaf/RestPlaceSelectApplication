import { supabase } from "../../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useOrderList = () => {
    return useQuery({
      queryKey: ['orders'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };

  export const useOrder = (id: number) => {
    return useQuery({
      queryKey: ['orders', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
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
        const { error, data: neworders } = await supabase
          .from('orders') // Исправлена опечатка
          .insert({
            title: data.title,
            country_id: data.countryId,
            is_deleted: 0,
          })
          .single();
  
        if (error) {
          throw new Error(error.message);
        }
        return neworders;
      },
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
      onError(error) {
        console.log(error);
      }
    });
  };
  
  export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(data: any) {
        const { error, data: updatedorders } = await supabase
          .from('orders')
          .update({
            title: data.title,
            country_id: data.country_id,
            is_deleted: 0,
          })
          .eq('id', data.id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }
        return updatedorders;
      },
      async onSuccess(_, { id }) {
        await queryClient.invalidateQueries({ queryKey: ['orders'] });
        await queryClient.invalidateQueries({ queryKey: ['orders', id] });
      },
      onError(error) {
        console.log("Mutation error:", error);
      }
    });
  };

  export const useDeleteOrder = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(id: number) {
        const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
        
        if (error) {
          throw new Error(error.message);
        }
      },
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
    });
  };

  export const useConsultantList = () => {
    return useQuery({
      queryKey: ['consultants'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('consultants')
          .select('*')
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };

  export const useServiceList = () => {
    return useQuery({
      queryKey: ['services'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('services')
          .select('*')
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };