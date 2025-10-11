import { DataTable } from "@/components/DataTable";
import { Product, getColumnsProducts } from "@/components/TableProductsColumns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from "react";


interface Props {
  products: Product[] | null;
  deleteProduct: (id: string) => void;
  setProductToUpdate: (product: Product | null) => void;
}


// Utility function to export data to CSV
const exportToCSV = (data: Product[], filename: string = 'productos.csv') => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Define the headers for CSV
  const headers = [
    'ID',
    'Nombre',
    'Unidad',
    'Precio Compra',
    'Precio Venta',
    'Margen Ganancia',
    'Stock',
    'Activo',
    'Última Actualización'
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(';'), // Header row
    ...data.map(product => [
      product.id,
      `"${product.name}"`, // Wrap in quotes to handle commas in names
      product.unit || '',
      product.buy_price,
      product.sell_price,
      // Calculate profit margin as percentage
      product.buy_price > 0 ? ((product.sell_price / product.buy_price - 1) * 100).toFixed(2) + '%' : '0%',
      product.stock,
      product.active ? 'Sí' : 'No',
      product.last_update ? new Date(product.last_update).toLocaleDateString('es-AR') : ''
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

export const TableProductsNew: React.FC<Props> = ({ products, deleteProduct, setProductToUpdate }) => {
  const columns = getColumnsProducts(deleteProduct, setProductToUpdate);
  
  const handleExportCSV = () => {
    if (products) {
      exportToCSV(products);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className='text-2xl font-roboto'>
          <span className='text-primary font-extrabold'>&gt;</span>
          &nbsp;&nbsp;Productos&nbsp;&nbsp;
          <span className='text-primary font-extrabold'>&lt;</span>
        </h1>
        <Button 
          onClick={handleExportCSV}
          disabled={!products || products.length === 0}
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
        data={products}
        emptyTableMsg="No hay productos registrados."
      />
    </div>
  )
};
