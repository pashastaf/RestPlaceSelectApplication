import { supabase } from "../../lib/supabase";
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useProfileList = () => {
    return useQuery({
      queryKey: ['profiles'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };

export const useProfile = (id: number) => {
  return useQuery({
    queryKey: ['profiles', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
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

export const useInsertProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: newDestination } = await supabase
        .from('profiles')
        .insert({
          // title: data.title,
          // country_id: data.countryId,
          // is_deleted: 0,
          first_name: data.firstName,
          second_name: data.secondName,
          email: data.email,
          password: data.password,
          group: data.group,
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newDestination;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
    onError(error) {
      console.log(error);
    }
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: updatedDestination } = await supabase
        .from('profiles')
        .update({
          // title: data.title,
          // country_id: data.country_id,
          // is_deleted: 0,
          first_name: data.first_name,
          second_name: data.second_name,
          email: data.email,
          password: data.password,
          group: data.group,
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
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      await queryClient.invalidateQueries({ queryKey: ['profiles', id] });
    },
    onError(error) {
      console.log("Mutation error:", error);
    }
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};