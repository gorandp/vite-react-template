import React from 'react';


export default class FormAddDrink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drinkName: "",
            drinkPrice: "",
        }
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    handleOnChange(event: any) {
        // Handle the change event
        if (event.target.id === "drink") {
            this.setState({
                drinkName: event.target.value
            });
        } else if (event.target.id === "price") {
            // check if the value is a number
            this.setState({
                drinkPrice: event.target.value
            });
        }
    }

    handleOnSubmit(event: any) {
        event.preventDefault();

        // Handle the submit event
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        fetch("/api/drinks/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.drink,
                price: data.price
            })
        })
        .then((res) => res.json() as Promise<{ name: string }>)
        .then((data) => {
            console.log(data);
            this.setState({
                drinkName: "",
                drinkPrice: "",
            });
        })
        .catch((error) => {
            console.error("Error:", error);
        }).finally(() => {
            // Reload the page
            window.location.reload();
        });

    }

    render(): React.ReactNode {
        // if (this.props.formType === "addDrink") {
        // }

        return (
            <section className="form-section">
                <h2>Registrar Bebida</h2>
                {/* Send form to a function */}
                <form id="salesForm" onSubmit={this.handleOnSubmit}>
                    <label>Bebida:
                        <input
                            type="text"
                            name="drink"
                            id="drink"
                            onChange={this.handleOnChange}
                            value={this.state.drinkName}
                            required />
                    </label>
                    <label>Precio unitario:
                        <input
                            type="number"
                            id="price"
                            name="price"
                            step="0.01"
                            min="0"
                            onChange={this.handleOnChange}
                            value={this.state.drinkPrice}
                            required />
                    </label>
                    <button type="submit">Agregar Bebida</button>
                </form>
            </section>
        )
    }
}