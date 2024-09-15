import { myAxios } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await myAxios.get("/auth/me");
      return response.data;
    },
  });
}
