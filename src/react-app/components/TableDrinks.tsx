import React from "react";

type Drink = {
    id: number;
    name: string;
    price: number;
}

interface Props {}
interface State {
    drinks: Drink[] | null;
}

export default class TableDrinks extends React.Component<{}, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            drinks: null,
        };
    }

    componentDidMount() {
        this.fetchDrinks();
    }

    fetchDrinks() {
        fetch("/api/drinks")
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    drinks: data,
                });
            });
    }

    deleteDrink(event: any, id: number) {
        event.preventDefault();
        fetch(`/api/drinks/delete/${id}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                this.fetchDrinks();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    render() {
        if (this.state.drinks === null) {
            return (
                <section className="table-section">
                    <h2>Bebidas</h2>
                    <p>Cargando...</p>
                </section>
            );
        }
        if (this.state.drinks.length === 0) {
            return (
                <section className="table-section">
                    <h2>Bebidas</h2>
                    <p>No hay bebidas registradas.</p>
                </section>
            );
        }
        return (
            <section className="table-section">
                <h2>Bebidas</h2>
                <table id="salesTable">
                    <thead>
                        <tr>
                            <th>Bebida</th>
                            <th>Precio unitario</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.drinks.map((drink: Drink) => (
                            <tr key={drink.id}>
                                <td>{drink.name}</td>
                                <td>{drink.price}</td>
                                <td>
                                    <button className="update-btn" type="submit">Actualizar</button>
                                    <form onSubmit={(event) => this.deleteDrink(event, drink.id)} method="post">
                                        <button className="delete-btn" type="submit" >Eliminar</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        );
    }
}
