import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
// Form components that pre-bind events from the form hook; check our "Form Composition" guide for more
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Product } from "./TableProductsColumns"
// We also support Valibot, ArkType, and any other standard schema library
import { z } from "zod"


const { fieldContext, formContext } = createFormHookContexts()

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
    Checkbox,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
})

interface ProductInput {
  id: string,
  name: string,
  unit: string,
  buy_price: number,
  sell_price: number,
  stock: number,
  _active: boolean,
}
const defaultProductInput: ProductInput = {
  id: "",
  name: "",
  unit: "",
  buy_price: 0,
  sell_price: 0,
  stock: 0,
  _active: false,
}

interface FormUpdateProductProps {
  updateProduct: (product: Product) => void;
  product: Product;
  setProductToUpdate: (product: Product | null) => void;
}


export const FormUpdateProduct = ({ updateProduct, product, setProductToUpdate }: FormUpdateProductProps) => {
  let resetForm = false;
  if (defaultProductInput.id !== product.id) {
    // Reset the form if the product id changes
    // console.log("Resetting form")
    resetForm = true;
  }

  // Set the default values for the form
  defaultProductInput.id = product.id
  defaultProductInput.name = product.name
  defaultProductInput.unit = product.unit
  defaultProductInput.buy_price = product.buy_price
  defaultProductInput.sell_price = product.sell_price
  defaultProductInput.stock = product.stock
  defaultProductInput._active = product.active

  // Create the form instance
  const form = useAppForm({
    defaultValues: defaultProductInput,
    validators: {
      // Pass a schema or function to validate
      onChange: z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        unit: z.string().min(1, "Unit is required"),
        buy_price: z.number().min(0, "Buy price must be positive"),
        sell_price: z.number().min(0, "Sell price must be positive"),
        stock: z.number().min(0, "Stock must be positive"),
        _active: z.boolean(),
      }),
    },
    onSubmit: ({value}) => {
      // alert(JSON.stringify(value, null, 2))
      console.log("Updating product", value);
      updateProduct({
        id: product.id,
        name: value.name,
        unit: value.unit,
        buy_price: value.buy_price,
        sell_price: value.sell_price,
        stock: value.stock,
        active: value._active,
        last_update: new Date().toISOString(),
      });
      // Reset the form after submission
      setProductToUpdate(null);
    },
  })

  if (resetForm) {
    // Reset the form if the product id changes
    form.reset()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <h1 className="mb-5 text-2xl font-roboto">
        <span className="text-primary font-extrabold">&gt;</span>
      &nbsp;&nbsp;Actualizar Bebida&nbsp;&nbsp;
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
              step="100"
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
              step="100"
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
      {/* The "name" property will throw a TypeScript error if typo"d  */}
      <form.AppField
        name="_active"
        children={(field) =>
          <label className="flex items-center gap-2 mb-5">
            <field.Checkbox
              id="_active"
              checked={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange((e.target as HTMLInputElement).checked)}
              className="h-4 w-4"
              />
            Estado activo
          </label>}
      />
      {/* Components in `form.AppForm` have access to the form context */}
      <form.AppForm>
        <form.Button className="mt-2 text-white bg-primary hover:bg-cyan-600">Actualizar</form.Button>
      </form.AppForm>
      <Button className="mt-2 ml-2" variant={"outline"} onClick={(_) => setProductToUpdate(null)} >Cancelar</Button>
    </form>
  )
}
