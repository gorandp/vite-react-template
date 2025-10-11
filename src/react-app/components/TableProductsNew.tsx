import { DataTable } from "@/components/DataTable";
import { Product, getColumnsProducts } from "@/components/TableProductsColumns";
import React from "react";


interface Props {
  products: Product[] | null;
  deleteProduct: (id: number) => void;
  setProductToUpdate: (product: Product | null) => void;
}


export const TableProductsNew: React.FC<Props> = ({ products, deleteProduct, setProductToUpdate }) => {
  const columns = getColumnsProducts(deleteProduct, setProductToUpdate);
  return (
    <div>
      <h1 className='mb-5 text-2xl font-roboto'>
        <span className='text-orange-500 font-extrabold'>&gt;</span>
        &nbsp;&nbsp;Productos&nbsp;&nbsp;
        <span className='text-orange-500 font-extrabold'>&lt;</span>
      </h1>
      <DataTable
        columns={columns}
        data={products}
        emptyTableMsg="No hay productos registrados."
      />
    </div>
  )
};
