import { myAxios } from "@/lib/axios"
import { queryClient } from "@/main"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LoadingSpinner } from "../loading-spinner"
import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"

const newVodSchema = z.object({
  title: z.string().min(3, {
    message: "A cím legalább 3 karakter hosszú",
  }),
})

export const AddVideoSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof newVodSchema>>({
    resolver: zodResolver(newVodSchema),
    defaultValues: {
      title: "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (dto: z.infer<typeof newVodSchema>) => {
      try {
        await myAxios.post("/videos", dto)
        await queryClient.invalidateQueries({ queryKey: ["vods"] })
        setIsOpen(false)
      } catch (e) {
        console.error(e)
        form.setError("title", {
          message: (e as AxiosError)?.message || "Error communicating with server",
        })
      }
    },
  })

  function onSubmit(values: z.infer<typeof newVodSchema>) {
    mutation.mutate(values)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="h-7 gap-1" onClick={() => setIsOpen(true)}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Új VoD projekt</span>
        </Button>
      </SheetTrigger>{" "}
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Új VoD projekt</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="py-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projekt címe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Később is megváltoztatható</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">{mutation.isPending ? <LoadingSpinner /> : "Küldés"}</Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
