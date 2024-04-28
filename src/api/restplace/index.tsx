import { supabase } from "../../lib/supabase";
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useRestPlaceList = () => {
    return useQuery({
      queryKey: ['rest_place'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('rest_place')
          .select('*')
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };

  export const useRestPlacesByDestinationId = (destinationId: number) => {
    return useQuery({
      queryKey: ['rest_places', { destinationId }],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('rest_place')
          .select('*')
          .eq('destination_id', destinationId);
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };

  export const useRestPlace = (id: number) => {
    return useQuery({
      queryKey: ['rest_place', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('rest_place')
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

  export const useInsertRestPlace = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(data: any) {
        const { error, data: newRestPlace } = await supabase
          .from('rest_place')
          .insert({
            title: data.title,
            destination_id: data.destinationId,
            is_deleted: 0,
          })
          .single();
  
        if (error) {
          throw new Error(error.message);
        }
        return newRestPlace;
      },
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: ['rest_place'] });
      },
      onError(error) {
        console.log(error);
      }
    });
  };
  
  export const useUpdateRestPlace = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(data: any) {
        const { error, data: updatedRestPlace } = await supabase
          .from('rest_place')
          .update({
            title: data.title,
            country_id: data.destinationId,
            is_deleted: 0,
          })
          .eq('id', data.id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }
        return updatedRestPlace;
      },
      async onSuccess(_, { id }) {
        await queryClient.invalidateQueries({ queryKey: ['rest_place'] });
        await queryClient.invalidateQueries({ queryKey: ['rest_place', id] });
      },
      onError(error) {
        console.log("Mutation error:", error);
      }
    });
  };

  export const useDeleteRestPlace = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(id: number) {
        const { error } = await supabase
        .from('rest_place')
        .delete()
        .eq('id', id);
        
        if (error) {
          throw new Error(error.message);
        }
      },
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: ['rest_place'] });
      },
    });
  };

