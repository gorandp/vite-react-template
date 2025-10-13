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
import { Pencil, ArrowDown } from "lucide-react"


export type Product = {
  id: string;
  name: string;
  unit: string;
  active: boolean;
  buy_price: number;
  sell_price: number;
  stock: number;
  last_update: string;
}


/* Column definitions for the table */
// Changed to a function that accepts a callback
export const getColumnsProducts = (
    deleteProduct: (id: string) => void,
    setProductToUpdate: (product: Product | null) => void
    ): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "unit",
    header: () => <div className="text-right">Unidad</div>,
    cell: ({ row }) => {
      const unit: string = row.getValue("unit")
      const formatted = unit ? unit : "-"

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "buy_price",
    header: () => <div className="text-right">Compra</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("buy_price"))
      const formatted = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "sell_price",
    header: () => <div className="text-right">Venta</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sell_price"))
      const formatted = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "profit_margin",
    header: () => <div className="text-right">Ganancia</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("profit_margin"))
      const formatted = new Intl.NumberFormat("es-AR", {
        style: "percent",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right">Stock</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("stock"))
      const formatted = new Intl.NumberFormat("es-AR", {
        style: "decimal",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "last_update",
    header: () => <div className="text-right">Última Actualización</div>,
    cell: ({ row }) => {
      const l_update = new Date(row.getValue("last_update"))
      const formatted = new Intl.DateTimeFormat("es-AR").format(l_update)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "active",
    header: () => <div className="text-right">Activo</div>,
    cell: ({ row }) => {
      const active = Boolean(row.getValue("active"))
      const formatted = active ? "Sí" : "No"

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

          {productData.active /* Only show delete if active */ && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <ArrowDown />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esto va a inhabilitar el producto.
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
          ) || <div className="w-8"></div> /* Placeholder to keep buttons aligned */}
        </div>
      )
    },
  },
]

