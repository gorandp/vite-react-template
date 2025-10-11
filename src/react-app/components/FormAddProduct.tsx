import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
// Form components that pre-bind events from the form hook; check our "Form Composition" guide for more
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// We also support Valibot, ArkType, and any other standard schema library
import { z } from "zod"

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

interface DrinkInput {
  drink: string
  price: number
}
const defaultDrinkInput: DrinkInput = {
  drink: "",
  price: 0,
}

interface FormAddDrinkProps {
  addDrink: (drink: { name: string; price: number }) => void;
}


export const FormAddDrink = ({ addDrink }: FormAddDrinkProps) => {
    const form = useAppForm({
      defaultValues: defaultDrinkInput,
      validators: {
        // Pass a schema or function to validate
        onChange: z.object({
          drink: z.string(),
          price: z.number(),
        }),
      },
      onSubmit: ({value}) => {
        // alert(JSON.stringify(value, null, 2))
        addDrink({
          name: value.drink,
          price: value.price,
        });
        // Reset the form after submission
        form.reset()
      },
    })

    return (
        <form
          onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
          }}
        >
          {/* <h1 className="mb-5 text-2xl font-headers decoration-dotted decoration-orange-500 underline decoration-3">Registrar Bebida</h1> */}
          <h1 className="mb-5 text-2xl font-roboto">
            <span className="text-orange-500 font-extrabold">&gt;</span>
          &nbsp;&nbsp;Registrar Bebida&nbsp;&nbsp;
            <span className="text-orange-500 font-extrabold">&lt;</span>
          </h1>
          {/* Components are bound to `form` and `field` to ensure extreme type safety */}
          {/* Use `form.AppField` to render a component bound to a single field */}
          <form.AppField
            name="drink"
            children={(field) => 
              <label>Nombre: 
                <field.Input
                  className="mb-5"
                  type="text"
                  name="drink"
                  id="drink"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required />
              </label>
            }
          />
          {/* The "name" property will throw a TypeScript error if typo"d  */}
          <form.AppField
            name="price"
            children={(field) =>
              <label>Precio unitario: 
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
          {/* Components in `form.AppForm` have access to the form context */}
          <form.AppForm>
            <form.Button className="mt-2">Agregar Bebida</form.Button>
          </form.AppForm>
        </form>
    )
}
