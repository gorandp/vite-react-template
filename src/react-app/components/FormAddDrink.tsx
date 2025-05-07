import React from 'react';
import { Button } from "@/components/ui/button";


interface Props {}
interface State {
    drinkName: string;
    drinkPrice: string;
}


export default class FormAddDrink extends React.Component<Props, State> {
    constructor(props: Props) {
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
        .then((data: any) => {
            console.log(data);
            if (data.error) {
                alert(data.errorEs);
                return;
            }
            this.setState({
                drinkName: "",
                drinkPrice: "",
            });
            // Reload the page
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

    render(): React.ReactNode {
        // if (this.props.formType === "addDrink") {
        // }

        return (
            <form id="salesForm" className='flex flex-col gap-5' onSubmit={this.handleOnSubmit}>
                {/* Send form to a function */}
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
                <Button type='submit'>Agregar Bebida</Button>
            </form>
        )
    }
}