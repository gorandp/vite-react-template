import { useState } from "react";
import { createFileRoute } from '@tanstack/react-router';

import FormAddDrink from "../components/FormAddDrink";
import TableDrinks from "../components/TableDrinks";

export const Route = createFileRoute('/drinks')({
  component: RouteComponent,
})

function RouteComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");
  //   const [title, setTitle] = useState("Tehuelches SN - Ventas");

  return (
    <>
      <div className="main">

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
                method: "POST"
              })
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
        <p className="read-the-docs text-3xl font-bold underline">Click on the logos to learn more</p>
      </div>
    </>
  )
}
