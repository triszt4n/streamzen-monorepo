import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info } from "lucide-react"
import { useFormContext } from "react-hook-form"

interface AvailabilityEditorProps {
  vodState: string
}

export const AvailabilityEditor: React.FC<AvailabilityEditorProps> = ({ vodState }) => {
  const form = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Láthatóság vendégek számára</CardTitle>
        {vodState !== "PROCESSED" && (
          <CardDescription>
            <Info className="h-3 w-3 mb-0.5 inline-block mr-1" />
            Nem szerkeszthető, amíg a videó feldolgozása nem fejeződik be
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem className="grid gap-3 grid-cols-2 items-center">
              <FormLabel>Videó elérhetősége a weboldalon</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={vodState !== "PROCESSED"}>
                <FormControl>
                  <SelectTrigger aria-label="Elérhetőség">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="UNLISTED">Unlisted</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
