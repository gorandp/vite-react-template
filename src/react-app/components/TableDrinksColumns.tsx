import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

export type Drink = {
  id: number;
  name: string;
  price: number;
}


/* Column definitions for the table */
// Changed to a function that accepts a callback
export const getColumnsDrinks = (deleteDrink: (id: number) => void): ColumnDef<Drink>[] => [
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

      return (
        <div className="flex justify-end gap-2">
          <Button variant="outline">
            <Pencil />
          </Button>

          <Button variant="destructive"
                  size="icon"
                  onClick={(event) => {
                    event.preventDefault();
                    deleteDrink(drinkData.id)
                  }}>
            <Trash2 />
          </Button>
        </div>
      )
    },
  },
]

