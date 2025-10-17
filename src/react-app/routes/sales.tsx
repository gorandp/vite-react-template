import { useEffect, useState } from "react";
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Header } from '@/components/Header';

import { FormAddSale } from '@/components/FormAddSale';
import { Sale } from '@/components/TableSalesColumns';
import { TableSales } from '@/components/TableSales';


export const Route = createFileRoute('/sales')({
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


const getCallbackFetchSales = (setSale: (data: object) => void) => {
  return () => {
    fetch("/api/sales", {
      method: "GET",
      headers: {
          "Authorization": `Bearer ${localStorage.getItem('JWT_TOKEN')}`
      },
    })
    .then((res) => {
      if (res.status === 401) {
        // alert("Sesión expirada. Por favor, inicie sesión de nuevo.");
        localStorage.removeItem('JWT_TOKEN');
        throw redirect({ to: '/login' });
      }
      return res.json();
    })
    .then((data) => {
      setSale(data);
    });
  }
}


const getCallbackAddSale = (fetchSales: () => void) => {
  return (sale: any) => {
    fetch("/api/sales/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('JWT_TOKEN')}`
        },
        body: JSON.stringify(sale),
    })
      .then((res) => res.json() as Promise<{ name: string }>)
      .then((data: any) => {
        console.log(data);
        if (data.error) {
          alert(data.errorEs);
          return;
        }
        fetchSales();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

const getCallbackDeleteSale = (fetchSales: () => void) => {
  return (id: number) => {
    fetch(`/api/sales/delete/${id}`, {
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
        fetchSales();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}


function RouteComponent() {
  const [sales, setSales] = useState<Sale[] | null>(null);
  const fetchSales = getCallbackFetchSales((data) => setSales(data as Sale[] || null));
  const deleteSale = getCallbackDeleteSale(fetchSales);
  const addSale = getCallbackAddSale(fetchSales);
  // const updateSale = getCallbackUpdateSale(fetchSales);
  // const [saleToUpdate, setSaleToUpdate] = useState<Sale | null>(null);
  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-3 justify-center m-0 p-0 mb-5">
        <section className="max-w-150 md:w-3/15 w-11/12 my-3 mx-0 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg shadow-md">
          <FormAddSale addSale={addSale} />
        </section>
        <section className="max-w-300 md:w-9/12 w-11/12 my-3 mx-0 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg shadow-md">
          <TableSales
            sales={sales}
            deleteSale={deleteSale} 
            setSaleToUpdate={(_) => {} }/>
        </section>
      </div>
    </div>
  )
}
