import { useEffect, useState } from "react";
import { createFileRoute, redirect } from '@tanstack/react-router';

import { FormAddProduct } from "../components/FormAddProduct";
import { FormUpdateProduct } from "@/components/FormUpdateProduct";
import { Product } from "@/components/TableProductsColumns";
import { TableProductsNew } from "@/components/TableProductsNew";
import { Header } from "@/components/Header";

export const Route = createFileRoute('/products')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (!localStorage.getItem('JWT_TOKEN')) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      })
    }
  },
})


const getCallbackFetchProducts = (setProducts: (data: object) => void) => {
  return () => {
    fetch("/api/products", {
      method: "GET",
      headers: {
          "Authorization": `Bearer ${localStorage.getItem('JWT_TOKEN')}`
      },
    })
    .then((res) => {
      if (res.status === 401) {
        // alert("Sesión expirada. Por favor, inicie sesión de nuevo.");
        localStorage.removeItem('JWT_TOKEN');
        redirect({ to: '/login' });
        return;
      }
      return res.json();
    })
    .then((data) => {
      setProducts(data);
    });
  }
}

const getCallbackAddProduct = (fetchProducts: () => void) => {
  return (product: {
      name: string,
      price: number,
      unit: string,
      buy_price: number,
      sell_price: number,
      stock: number,
    }) => {
    fetch("/api/products/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('JWT_TOKEN')}`
        },
        body: JSON.stringify(product),
    })
      .then((res) => res.json() as Promise<{ name: string }>)
      .then((data: any) => {
        console.log(data);
        if (data.error) {
          alert(data.errorEs);
          return;
        }
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

const getCallbackDeleteProduct = (fetchProducts: () => void) => {
  return (id: string) => {
    fetch(`/api/products/delete/${id}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('JWT_TOKEN')}`
        }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert(data.errorEs);
          return;
        }
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

const getCallbackUpdateProduct = (fetchProducts: () => void) => {
  return (product: {
      id: string,
      name: string,
      unit: string,
      buy_price: number,
      sell_price: number,
      stock: number,
      active: boolean,
    }) => {
    fetch(`/api/products/update/${product.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('JWT_TOKEN')}`
        },
        body: JSON.stringify(product),
    })
      .then((res) => res.json() as Promise<{ name: string }>)
      .then((data: any) => {
        console.log(data);
        if (data.error) {
          alert(data.errorEs);
          return;
        }
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}


function RouteComponent() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const fetchProducts = getCallbackFetchProducts((data) => setProducts(data as Product[] || null));
  const deleteProduct = getCallbackDeleteProduct(fetchProducts);
  const addProduct = getCallbackAddProduct(fetchProducts);
  const updateProduct = getCallbackUpdateProduct(fetchProducts);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-3 justify-center m-0 p-0 mb-5">

        <section className="max-w-150 md:w-3/15 w-11/12 my-3 mx-0 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg shadow-md">
        {(productToUpdate === null) ? (
              <FormAddProduct addProduct={addProduct} />
          ) : (
              <FormUpdateProduct
                updateProduct={updateProduct}
                product={productToUpdate}
                setProductToUpdate={setProductToUpdate} />
          )
        }
        </section>
        <section className="max-w-300 md:w-9/12 w-11/12 my-3 mx-0 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg shadow-md">
          <TableProductsNew
            products={products}
            deleteProduct={deleteProduct}
            setProductToUpdate={setProductToUpdate} />
        </section>
      </div>
    </div>
  )
}
