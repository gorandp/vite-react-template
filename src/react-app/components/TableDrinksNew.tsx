import { DataTable } from "@/components/DataTable";
import { Drink, columnsDrinks } from "@/components/TableDrinksColumns";
import React from "react";


interface TableDrinksNewState {
  drinks: Drink[];
}

export class TableDrinksNew extends React.Component<{}, TableDrinksNewState> {
  constructor(props: any) {
    super(props);
    this.state = {
      drinks: [],
    };
  }
  componentDidMount() {
    this.fetchDrinks();
  }
  componentDidUpdate() {
    this.fetchDrinks();
  }
  fetchDrinks() {
    fetch("/api/drinks")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ drinks: data });
      });
  }
  render() {
    return (
      <div>
        <h1 className='mb-5 text-2xl font-roboto'>
          <span className='text-orange-500 font-extrabold'>&gt;</span>
          &nbsp;&nbsp;Bebidas&nbsp;&nbsp;
          <span className='text-orange-500 font-extrabold'>&lt;</span>
        </h1>
        <DataTable
          columns={columnsDrinks}
          data={this.state.drinks}
          emptyTableMsg="No hay bebidas registradas."
        />
      </div>
    )
  }
}
