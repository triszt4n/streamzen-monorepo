import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormContext } from "react-hook-form"

export const AllowsEditor = () => {
  const form = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engedélyezések vendégek számára</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 grid-cols-1">
          <FormField
            control={form.control}
            name="allowDownloads"
            render={({ field }) => (
              <FormItem className="grid gap-3 grid-cols-2 items-center">
                <FormLabel>Letöltések (HD és normál minőségben)</FormLabel>
                <Select onValueChange={(value) => field.onChange(value == "1" ? true : false)} value={field.value == true ? "1" : "0"}>
                  <FormControl>
                    <SelectTrigger aria-label="Letöltések">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Engedélyezve</SelectItem>
                    <SelectItem value="0">Tiltva</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allowShare"
            render={({ field }) => (
              <FormItem className="grid gap-3 grid-cols-2 items-center">
                <FormLabel>Megosztás gomb</FormLabel>
                <Select onValueChange={(value) => field.onChange(value == "1" ? true : false)} value={field.value == true ? "1" : "0"}>
                  <FormControl>
                    <SelectTrigger aria-label="Megosztás gomb">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Engedélyezve</SelectItem>
                    <SelectItem value="0">Tiltva</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
