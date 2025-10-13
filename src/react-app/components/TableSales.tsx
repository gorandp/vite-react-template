import { DataTable } from "@/components/DataTable";
import { Sale, getColumnsSales } from "@/components/TableSalesColumns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from "react";


interface Props {
  sales: Sale[] | null;
  deleteProduct: (id: string) => void;
  setProductToUpdate: (sale: Sale | null) => void;
}


// Utility function to export data to CSV
const exportToCSV = (data: Sale[], filename: string = 'ventas.csv') => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Define the headers for CSV
  const headers = [
    'ID Venta',
    'ID Combo',
    'Nombre Combo',
    'ID Producto',
    'Nombre Producto',
    'Unidad',
    'Método de Pago',
    'Precio Unitario Venta',
    'Cantidad Vendida',
    'Total Venta',
    'Fecha'
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(';'), // Header row
    ...data.map(sale => [
      sale.link_hash,
      sale.combo_id || '',
      sale.combo_name ? `"${sale.combo_name}"` : '',
      sale.product_id,
      `"${sale.product_name}"`, // Wrap in quotes to handle commas in names
      sale.product_unit ? `"${sale.product_unit}"` : '',
      sale.payment_method ? `"${sale.payment_method}"` : '',
      sale.product_unit_sell_price,
      sale.quantity,
      sale.total_amount,
      sale.sale_date ? new Date(sale.sale_date).toLocaleDateString('es-AR') : ''
    ].join(';'))
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const TableSalesNew: React.FC<Props> = ({ sales, deleteProduct, setProductToUpdate }) => {
  const columns = getColumnsSales(deleteProduct, setProductToUpdate);

  const handleExportCSV = () => {
    if (sales) {
      exportToCSV(sales);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className='text-2xl font-roboto'>
          <span className='text-primary font-extrabold'>&gt;</span>
          &nbsp;&nbsp;Ventas&nbsp;&nbsp;
          <span className='text-primary font-extrabold'>&lt;</span>
        </h1>
        <Button
          onClick={handleExportCSV}
          disabled={!sales || sales.length === 0}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={sales}
        emptyTableMsg="No hay ventas registradas."
      />
    </div>
  )
};
