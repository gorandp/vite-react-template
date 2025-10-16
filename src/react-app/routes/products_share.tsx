import { useEffect, useState } from "react";
import { createFileRoute, redirect } from '@tanstack/react-router'
import { TableProductsShare } from "@/components/TableProductsShare";
import { Product } from "@/components/TableProductsShareColumns";


export const Route = createFileRoute('/products_share')({
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
          throw redirect({ to: '/login' });
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      });
  }
}


function RouteComponent() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const fetchProducts = getCallbackFetchProducts((data) => setProducts(data as Product[] || null));
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <TableProductsShare products={products} />
    </div>
  )
}
