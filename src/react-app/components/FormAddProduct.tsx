import { createFormHook, createFormHookContexts, useStore } from "@tanstack/react-form"
// Form components that pre-bind events from the form hook; check our "Form Composition" guide for more
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// We also support Valibot, ArkType, and any other standard schema library
import { z } from "zod"
import React from "react"

const { fieldContext, formContext } = createFormHookContexts()

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
})

interface ProductInput {
  name: string
  unit: string
  buy_price: number
  sell_price: number
  profit_margin: number
  stock: number
}
const defaultProductInput: ProductInput = {
  name: "",
  unit: "",
  buy_price: 0,
  sell_price: 0,
  profit_margin: 0,
  stock: 0,
}

interface FormAddProductProps {
  addProduct: (product: {
    name: string;
    unit: string;
    buy_price: number;
    sell_price: number;
    profit_margin: number;
    stock: number;
  }) => void;
}


export const FormAddProduct = ({ addProduct }: FormAddProductProps) => {
  const form = useAppForm({
    defaultValues: defaultProductInput,
    validators: {
      // Pass a schema or function to validate
      onChange: z.object({
        name: z.string().min(1, "Name is required"),
        unit: z.string().min(1, "Unit is required"),
        buy_price: z.number().min(0, "Buy price must be positive"),
        sell_price: z.number().min(0, "Sell price must be positive"),
        profit_margin: z.number().min(0, "Profit margin must be positive"),
        stock: z.number().min(0, "Stock must be positive"),
      }),
    },
    onSubmit: ({value}) => {
      // alert(JSON.stringify(value, null, 2))
      addProduct({...value, profit_margin: value.profit_margin / 100});
      // Reset the form after submission
      form.reset()
    },
  })
  const buyPrice = useStore(form.store, (state) => state.values.buy_price)
  const sellPrice = useStore(form.store, (state) => state.values.sell_price)
  const profitMargin = useStore(form.store, (state) => state.values.profit_margin)

  React.useEffect(() => {
    // Update sell_price when buy_price or profit_margin changes
    if (buyPrice && profitMargin) {
      const newSellPrice = buyPrice * (1 + (profitMargin / 100));
      form.state.values.sell_price = parseInt(newSellPrice.toFixed(0));
      // form.setValue("sell_price", parseFloat(newSellPrice.toFixed(2)));
    }
  }, [buyPrice, profitMargin]);

  React.useEffect(() => {
    // Update profit_margin when sell_price changes
    if (buyPrice && sellPrice) {
      const newProfitMargin = ((sellPrice / buyPrice) - 1) * 100;
      form.state.values.profit_margin = parseFloat(newProfitMargin.toFixed(2));
      // form.setValue("profit_margin", parseFloat(newProfitMargin.toFixed(2)));
    }
  }, [sellPrice]);

  return (
    <form
      onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
      }}
    >
      {/* <h1 className="mb-5 text-2xl font-headers decoration-dotted decoration-primary underline decoration-3">Registrar Bebida</h1> */}
      <h1 className="mb-5 text-2xl font-roboto">
        <span className="text-primary font-extrabold">&gt;</span>
      &nbsp;&nbsp;Registrar Producto&nbsp;&nbsp;
        <span className="text-primary font-extrabold">&lt;</span>
      </h1>
      {/* Components are bound to `form` and `field` to ensure extreme type safety */}
      {/* Use `form.AppField` to render a component bound to a single field */}
      <form.AppField
        name="name"
        children={(field) => 
          <label>Nombre: 
            <field.Input
              className="mb-5"
              type="text"
              name="name"
              id="name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required />
          </label>
        }
      />
      {/* Use `form.AppField` to render a component bound to a single field */}
      <form.AppField
        name="unit"
        children={(field) => 
          <label>Unidad: 
            <field.Input
              className="mb-5"
              type="text"
              name="unit"
              id="unit"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required />
          </label>
        }
      />
      {/* The "name" property will throw a TypeScript error if typo"d  */}
      <form.AppField
        name="buy_price"
        children={(field) =>
          <label>Precio unitario de compra: 
            <field.Input
              className="mb-5"
              type="number"
              min="0"
              value={field.state.value || ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              required />
          </label>}
      />
      {/* The "name" property will throw a TypeScript error if typo"d  */}
      <form.AppField
        name="sell_price"
        children={(field) =>
          <label>Precio unitario de venta: 
            <field.Input
              className="mb-5"
              type="number"
              step="10"
              min="0"
              value={field.state.value || ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              required />
          </label>}
      />
      {/* The "name" property will throw a TypeScript error if typo"d  */}
      <form.AppField
        name="profit_margin"
        children={(field) =>
          <label>Margen de ganancia: 
            <field.Input
              className="mb-5"
              type="number"
              step="0.01"
              min="0"
              value={field.state.value || ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              required />
          </label>}
      />
      {/* The "name" property will throw a TypeScript error if typo"d  */}
      {/* <form.AppField
        name="primary_products"
        children={(field) =>
          <label>Productos primarios: 
            <field.Input
              className="mb-5"
              type="number"
              step="100"
              min="0"
              value={field.state.value || ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              required />
          </label>}
      /> */}
      {/* The "name" property will throw a TypeScript error if typo"d  */}
      <form.AppField
        name="stock"
        children={(field) =>
          <label>Stock inicial: 
            <field.Input
              className="mb-5"
              type="number"
              min="0"
              value={field.state.value || ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              required />
          </label>}
      />
      {/* Components in `form.AppForm` have access to the form context */}
      <form.AppForm>
        <form.Button className="mt-2 text-white">Agregar Producto</form.Button>
      </form.AppForm>
    </form>
  )
}
