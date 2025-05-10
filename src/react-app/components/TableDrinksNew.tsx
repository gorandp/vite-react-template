import { DataTable } from "@/components/DataTable";
import { Drink, getColumnsDrinks } from "@/components/TableDrinksColumns";
import React from "react";


interface Props {
  drinks: Drink[] | null;
  deleteDrink: (id: number) => void;
}


export const TableDrinksNew: React.FC<Props> = ({ drinks, deleteDrink }) => {
  const columns = getColumnsDrinks(deleteDrink);
  return (
    <div>
      <h1 className='mb-5 text-2xl font-roboto'>
        <span className='text-orange-500 font-extrabold'>&gt;</span>
        &nbsp;&nbsp;Bebidas&nbsp;&nbsp;
        <span className='text-orange-500 font-extrabold'>&lt;</span>
      </h1>
      <DataTable
        columns={columns}
        data={drinks}
        emptyTableMsg="No hay bebidas registradas."
      />
    </div>
  )
};
