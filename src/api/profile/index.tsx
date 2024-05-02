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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: updatedProfile } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          second_name: data.secondName,
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
      return updatedProfile;
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
