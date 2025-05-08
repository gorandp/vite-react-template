import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

export type Drink = {
  id: number;
  name: string;
  price: number;
}


/* Column definitions for the table */

export const columnsDrinks: ColumnDef<Drink>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Precio unitario</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const drinkData = row.original
      console.log(drinkData)

      return (
        <div className="flex justify-end gap-2">
          <Button variant="outline">
            <Pencil />
          </Button>

          <Button variant="destructive" size="icon">
            <Trash2 />
          </Button>
        </div>
      )
    },
  },
]

