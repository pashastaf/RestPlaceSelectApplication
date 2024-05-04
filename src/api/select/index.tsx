import { supabase } from "../../lib/supabase";
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useOrderPlacesList = () => {
    return useQuery({
      queryKey: ['orders_places'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('orders_places')
          .select('*')
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };