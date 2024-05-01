import { supabase } from "../../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useDestinationList = () => {
    return useQuery({
      queryKey: ['destination'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('destination')
          .select('*')
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };

  export const useDestination = (id: number) => {
    return useQuery({
      queryKey: ['destination', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('destination')
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

  export const useInsertDestination = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(data: any) {
        const { error, data: newDestination } = await supabase
          .from('destination') // Исправлена опечатка
          .insert({
            title: data.title,
            country_id: data.countryId,
            is_deleted: 0,
          })
          .single();
  
        if (error) {
          throw new Error(error.message);
        }
        return newDestination;
      },
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: ['destination'] });
      },
      onError(error) {
        console.log(error);
      }
    });
  };
  
  export const useUpdateDestination = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(data: any) {
        const { error, data: updatedDestination } = await supabase
          .from('destination')
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
        return updatedDestination;
      },
      async onSuccess(_, { id }) {
        await queryClient.invalidateQueries({ queryKey: ['destination'] });
        await queryClient.invalidateQueries({ queryKey: ['destination', id] });
      },
      onError(error) {
        console.log("Mutation error:", error);
      }
    });
  };

  export const useDeleteDestination = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(id: number) {
        const { error } = await supabase
        .from('destination')
        .delete()
        .eq('id', id);
        
        if (error) {
          throw new Error(error.message);
        }
      },
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: ['destination'] });
      },
    });
  };