import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"

export const DetailsEditor = () => {
  const form = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projekt részletei</CardTitle>
        <CardDescription>Alapvető információ a VoD projektről</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cím</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="descMarkdown"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leírás</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-32" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
