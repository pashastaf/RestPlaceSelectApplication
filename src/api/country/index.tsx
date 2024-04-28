import { supabase } from "../../lib/supabase";
import { useQuery } from "@tanstack/react-query"

export const useCountryList = () => {
    return useQuery({
      queryKey: ['country'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('country')
          .select('*')
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };