import { myAxios } from "@/lib/axios"
import { MeDto } from "@/lib/dto"
import { useQuery } from "@tanstack/react-query"

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await myAxios.get<MeDto>("/auth/me")
      return response.data
    },
  })
}
