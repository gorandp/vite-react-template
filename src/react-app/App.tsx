// src/App.tsx

import { useState } from "react";
import favicon from "./assets/favicon.ico";
import logoTehuelches from "./assets/logo_tehuelches_transparent_background.png";
import "./App.css";
import Title from "./components/Title";
import FormAddDrink from "./components/FormAddDrink";
import TableDrinks from "./components/TableDrinks";


function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");
  const [title, setTitle] = useState("Tehuelches SN - Ventas");

  return (
    <>
        <head>
            <Title content={title} />
        </head>
        <div className="main">
        <header>
            <div className="left-header">
                <img className="logo" src={logoTehuelches} alt="Logo" />
                <h1>Tehuelches ventas</h1>
            </div>
            <div className="right-header">
                <nav>
                    <ul>
                        <li className="nav-btn"><a href="/sales">Ventas</a></li>
                        <li className="nav-btn"><a href="/drinks">Bebidas</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        {/* <section className="form-section">
            <h2>Registrar Bebida</h2>
            <form id="salesForm" action="TODO" method="post">
                <label>Bebida:
                    <input type="text" name="drink" id="drink" required />
                </label>
                <label>Precio unitario:
                    <input type="number" id="price" name="price" step="0.01" min="0" required />
                </label>
                <button type="submit">Agregar Bebida</button>
            </form>
        </section> */}

        <FormAddDrink />
        <TableDrinks />


        <div className="card">
            <button
            onClick={() => setCount((count) => count + 1)}
            aria-label="increment"
            >
            count is {count}
            </button>
            <p>
            Edit <code>src/App.tsx</code> and save to test HMR
            </p>
        </div>
        <div className="card">
            <button
            onClick={() => {
                fetch("/api/drinks/initTable", {
                method: "POST"})
                .then((res) => res.json() as Promise<{ name: string }>)
                .then((data) => setName(data.name));
            }}
            aria-label="get name"
            >
            Create table drinks {name}
            </button>
            <button
            onClick={() => {
                fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: "gogos", password: "1234", roles: ["salesman"] })
                })
                .then((res) => res.json() as Promise<{ name: string }>)
                .then((data) => setName(data.name));
            }}
            aria-label="get name"
            >
            Add user {name}
            </button>
            <button
            onClick={() => {
                fetch("/api/drinks")
                .then((res) => res.json() as Promise<{ name: string }>)
                .then((data) => setName(data.name));
            }}
            aria-label="get name"
            >
            Get drinks {name}
            </button>
            <p>
            Edit <code>worker/index.ts</code> to change the name
            </p>
        </div>
        <p className="read-the-docs">Click on the logos to learn more</p>
        </div>
    </>
  );
}

export default App;
