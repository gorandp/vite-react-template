import { useEffect, useState } from "react";
import { createFileRoute } from '@tanstack/react-router';

import { FormAddDrink } from "../components/FormAddProduct";
import { FormUpdateDrink } from "@/components/FormUpdateProduct";
import { Product } from "@/components/TableProductsColumns";
import { TableProductsNew } from "@/components/TableProductsNew";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute('/products')({
  component: RouteComponent,
})


const getCallbackFetchProducts = (setProducts: (data: object) => void) => {
  return () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
    });
  }
}

const getCallbackAddProduct = (fetchDrinks: () => void) => {
  return (drink: { name: string, price: number }) => {
    fetch("/api/products/add", {
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

const getCallbackDeleteProduct = (fetchDrinks: () => void) => {
  return (id: number) => {
    fetch(`/api/products/delete/${id}`, {
        method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
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

const getCallbackUpdateProduct = (fetchDrinks: () => void) => {
  return (drink: { id: number, name: string, price: number }) => {
    fetch(`/api/products/update/${drink.id}`, {
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


function RouteComponent() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const fetchDrinks = getCallbackFetchProducts((data) => setProducts(data as Product[] || null));
  const deleteDrink = getCallbackDeleteProduct(fetchDrinks);
  const addDrink = getCallbackAddProduct(fetchDrinks);
  const updateDrink = getCallbackUpdateProduct(fetchDrinks);
  const [drinkToUpdate, setDrinkToUpdate] = useState<Product | null>(null);
  useEffect(() => {
    fetchDrinks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center m-0 p-0 mb-5">

        <section className="max-w-160 sm:w-9/12 w-11/12 my-3 mx-0 bg-white p-4 rounded-lg shadow-md">
        {(drinkToUpdate === null) ? (
              <FormAddDrink addDrink={addDrink} />
          ) : (
              <FormUpdateDrink
                updateDrink={updateDrink}
                drink={drinkToUpdate}
                setDrinkToUpdate={setDrinkToUpdate} />
          )
        }
        </section>
        <section className="max-w-160 sm:w-9/12 w-11/12 my-3 mx-0 bg-white p-4 rounded-lg shadow-md">
          <TableProductsNew
            products={products}
            deleteProduct={deleteDrink}
            setProductToUpdate={setDrinkToUpdate} />
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
              fetch("/api/products/initTable", {
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
              fetch("/api/products")
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
      <Footer />
    </div>
  )
}
