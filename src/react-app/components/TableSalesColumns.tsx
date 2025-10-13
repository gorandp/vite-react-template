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


export type Sale = {
  id: number;
  link_hash: string;
  customer_id: string;
  combo_id: string | null;
  combo_name: string | null;
  product_id: string;
  product_name: string;
  product_unit: string;
  payment_method: string;
  product_unit_sell_price: number;
  quantity: number;
  total_amount: number;
  sale_date: string;
};


/* Column definitions for the table */
// Changed to a function that accepts a callback
export const getColumnsSales = (
  deleteSale: (id: number) => void,
  setSaleToUpdate: (sale: Sale | null) => void
): ColumnDef<Sale>[] => [
    {
      accessorKey: "link_hash",
      header: "Hash",
    },
    {
      accessorKey: "combo_name",
      header: "Combo",
    },
    {
      accessorKey: "product_name",
      header: "Producto"
    },
    {
      accessorKey: "product_unit",
      header: "Unidad"
    },
    {
      accessorKey: "payment_method",
      header: "Método de Pago"
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right">Cantidad</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("quantity"))
        const formatted = new Intl.NumberFormat("es-AR", {
          style: "decimal",
        }).format(amount)

        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "total_amount",
      header: () => <div className="text-right">Monto Total</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"))
        const formatted = new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(amount)

        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "sale_date",
      header: () => <div className="text-right">Fecha</div>,
      cell: ({ row }) => {
        const l_update = new Date(row.getValue("sale_date"))
        const formatted = new Intl.DateTimeFormat("es-AR").format(l_update)

        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const saleData = row.original
        const saleDate = new Date(saleData.sale_date);
        if (saleDate < new Date()) {
          // If the sale date is in the past, do not allow editing or deleting
          return (
            <div className="text-right text-sm italic text-gray-500">Pasada</div>
          )
        }

        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline"
              size="icon"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setSaleToUpdate(saleData);
              }}>
              <Pencil />
            </Button>

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
                    Esto va a borrar la venta (y todas las líneas asociadas).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={(event) => {
                      event.preventDefault();
                      deleteSale(saleData.id);
                    }}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

