import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle } from "lucide-react"
import { UserCombobox } from "../user-combobox"

export const CrewEditor = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stáb</CardTitle>
        <CardDescription>Kezeld a videó megvalósulásában segédkező stábtagokat</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Szerep</TableHead>
              <TableHead>Név</TableHead>
              <TableHead className="w-24">Prio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">
                <Input />
              </TableCell>
              <TableCell className="">
                <UserCombobox />
              </TableCell>
              <TableCell className="">
                <Input type="number" min="0" max="10000" step="50" defaultValue="100" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <Button size="sm" variant="ghost" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          Stábtag hozzáadása
        </Button>
      </CardFooter>
    </Card>
  )
}
