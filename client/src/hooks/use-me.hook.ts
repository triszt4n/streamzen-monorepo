import { myAxios } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export interface MeDto {
  email: string;
  firstName: string;
  fullName: string;
  imageUrl: string;
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await myAxios.get<MeDto>("/auth/me");
      return response.data;
    },
  });
}
