import { myAxios } from "@/lib/axios"
import { VodDto } from "@/lib/dto"
import { badgeVariantForField, formatDateTime, translateField } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"
import { Link } from "react-router-dom"
import { LoadingSpinner } from "../loading-spinner"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

export const TabAllVods = () => {
  const {
    data: vods,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["vods"],
    queryFn: async () => {
      const response = await myAxios.get<VodDto[]>("/videos")
      return response.data
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video-on-Demand projektek</CardTitle>
        <CardDescription>Kezeld a VoD projekteket, vizsgáld státuszaik és nézettségük itt</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Thumbnail</span>
              </TableHead>
              <TableHead>Projekt címe</TableHead>
              <TableHead>Feldolgozottság</TableHead>
              <TableHead>Elérhetőség</TableHead>
              <TableHead className="hidden md:table-cell">Nézettség</TableHead>
              <TableHead className="hidden md:table-cell">Készült</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div>
                    <LoadingSpinner />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="text-center">Nem sikerült betölteni az adatokat</div>
                </TableCell>
              </TableRow>
            )}
            {vods?.map((vod) => (
              <TableRow key={vod.id}>
                <TableCell className="hidden sm:table-cell">
                  <img
                    alt="Product img"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={vod.thumbnailUrl ?? "/placeholder-vod.png"}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-vod.png"
                    }}
                    width="54"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link to={`/studio/edit/${vod.id}`}>{vod.title}</Link>
                </TableCell>
                <TableCell>
                  <Badge variant={badgeVariantForField("state", vod.state)}>{translateField("state", vod.state)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={badgeVariantForField("availability", vod.availability)}>{translateField("availability", vod.availability)}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">25 000</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div>{formatDateTime(vod.createdAt)}</div>
                  <div className="text-xs text-muted-foreground">
                    kiadó:{" "}
                    <Link to={`/users/${vod.author.id}`} className="hover:underline">
                      {vod.author.fullName}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Műveletek:</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link to={`/studio/edit/${vod.id}`}>Szerkesztés</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Törlés</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Látható: <strong>1-{Math.min(vods?.length ?? 10, 10)}</strong> - összesen: <strong>{vods?.length ?? (isLoading ? "Loading..." : 0)}</strong> projekt
        </div>
      </CardFooter>
    </Card>
  )
}
