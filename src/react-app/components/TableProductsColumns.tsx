import { ColumnDef } from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

export type Product = {
  id: number;
  name: string;
  price: number;
}


/* Column definitions for the table */
// Changed to a function that accepts a callback
export const getColumnsProducts = (
    deleteProduct: (id: number) => void,
    setProductToUpdate: (product: Product | null) => void
    ): ColumnDef<Product>[] => [
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
      const productData = row.original

      return (
        <div className="flex justify-end gap-2">
          <Button variant="outline"
                  size="icon"
                  onClick={(event) => {
                    event.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setProductToUpdate(productData);
                  }}>
            <Pencil />
          </Button>



          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer.
                  Esto va a borrar permanentemente la bebida.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={(event) => {
                    event.preventDefault();
                    deleteProduct(productData.id);
                  }}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]

