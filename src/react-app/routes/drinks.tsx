import { useEffect, useState } from "react";
import { createFileRoute } from '@tanstack/react-router';

// import TableDrinks from "../components/TableDrinks";
import { FormAddDrink } from "../components/FormAddDrink";
import { Drink } from "@/components/TableDrinksColumns";
import { TableDrinksNew } from "@/components/TableDrinksNew";

export const Route = createFileRoute('/drinks')({
  component: RouteComponent,
})


const getCallbackFetchDrinks = (setDrinks: (data: object) => void) => {
  return () => {
    fetch("/api/drinks")
      .then((res) => res.json())
      .then((data) => {
        setDrinks(data);
    });
  }
}

const getCallbackAddDrink = (fetchDrinks: () => void) => {
  return (drink: { name: string, price: number }) => {
    fetch("/api/drinks/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(drink),
    })
      .then((res) => res.json() as Promise<{ name: string }>)
      .then((data: any) => {
        console.log(data);
        if (data.error) {
          alert(data.errorEs);
          return;
        }
        fetchDrinks();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

const getCallbackDeleteDrink = (fetchDrinks: () => void) => {
  return (id: number) => {
    fetch(`/api/drinks/delete/${id}`, {
        method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchDrinks();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}


function RouteComponent() {
  const [drinks, setDrinks] = useState<Drink[] | null>(null);
  const fetchDrinks = getCallbackFetchDrinks((data) => setDrinks(data as Drink[] || null));
  const deleteDrink = getCallbackDeleteDrink(fetchDrinks);
  const addDrink = getCallbackAddDrink(fetchDrinks);
  useEffect(() => {
    fetchDrinks();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center m-0 p-0 mb-5">

        <section className="max-w-160 sm:w-9/12 w-11/12 my-3 mx-0 bg-white p-4 rounded-lg shadow-md">
          <FormAddDrink addDrink={addDrink} />
        </section>

        {/* <section className="max-w-160 sm:w-9/12 w-11/12 my-3 mx-0 bg-white p-4 rounded-lg shadow-md">
          <h2>Bebidas</h2>
          <TableDrinks />
        </section> */}

        <section className="max-w-160 sm:w-9/12 w-11/12 my-3 mx-0 bg-white p-4 rounded-lg shadow-md">
          <TableDrinksNew drinks={drinks} deleteDrink={deleteDrink} />
        </section>
        {/* 
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
        <p className="read-the-docs text-3xl font-bold underline">Click on the logos to learn more</p> */}
      </div>
    </>
  )
}
