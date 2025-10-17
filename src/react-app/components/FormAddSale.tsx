import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
// Form components that pre-bind events from the form hook; check our "Form Composition" guide for more
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// We also support Valibot, ArkType, and any other standard schema library
// import { z } from "zod"

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

interface SaleBlockInput {
  combo_id: string | null;
  product_id: string;
  quantity: number;
}
interface SaleInput {
  payment_method: string;
  sale_blocks: SaleBlockInput[];
  sale_date: string | null;
}

const defaultSaleInput: SaleInput = {
  payment_method: "",
  sale_blocks: [
    { combo_id: null, product_id: '', quantity: 0 }
  ],
  sale_date: null,
}

interface FormAddSaleProps {
  addSale: (sale: {
    payment_method: string;
    sale_blocks: SaleBlockInput[];
    sale_date: string | null;
  }) => void;
}


export const FormAddSale = ({ addSale }: FormAddSaleProps) => {
  const form = useAppForm({
    defaultValues: defaultSaleInput,
    validators: {
      // Pass a schema or function to validate
      onChange: (_) => { }, /*z.object({
        payment_method: z.string().min(1, "Payment method is required"),
        sale_blocks: z.array(z.object({
          combo_id: z.string().nullable(),
          product_id: z.string().min(1, "Product ID is required"),
          quantity: z.number().min(1, "Quantity must be at least 1"),
        })).min(1, "At least one sale block is required"),
        sale_date: z.string().min(1, "Sale date is required"),
      })*/
    },
    onSubmit: ({value}) => {
      // alert(JSON.stringify(value, null, 2))
      alert(JSON.stringify(value, null, 2))
      addSale(value);
      // Reset the form after submission
      form.reset()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      {/* <h1 className="mb-5 text-2xl font-headers decoration-dotted decoration-primary underline decoration-3">Registrar Bebida</h1> */}
      <h1 className="mb-5 text-2xl font-roboto">
        <span className="text-primary font-extrabold">&gt;</span>
      &nbsp;&nbsp;Registrar Venta&nbsp;&nbsp;
        <span className="text-primary font-extrabold">&lt;</span>
      </h1>
      {/* Components are bound to `form` and `field` to ensure extreme type safety */}
      {/* Use `form.AppField` to render a component bound to a single field */}
      <form.Field name="sale_blocks" mode="array">
        {(field) => (
          <div>
            {field.state.value.map((_, i) => {
              return (
                <form.AppField
                  key={i}
                  name={`sale_blocks[${i}].combo_id`}
                  children={(subField) =>
                    <label>Combo ID (opcional):
                      <subField.Input
                        value={subField.state.value || ""}
                        onChange={(e) => subField.handleChange(e.target.value)}
                      />
                    </label>}
                />
              )
            })}
            {/* this button must not submit the form */}
            <Button
              type="button"
              className="mt-2 ml-2"
              variant={"outline"}
              onClick={() => field.pushValue({ combo_id: null, product_id: '', quantity: 0 })}
            >
              Agregar Producto
            </Button>
          </div>
        )}
      </form.Field>

      {/* <form.AppField
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
      /> */}
      <form.AppForm>
        <form.Button className="mt-2 text-white">Enviar</form.Button>
      </form.AppForm>
    </form>
  )
}
