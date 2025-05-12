import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
// Form components that pre-bind events from the form hook; check our "Form Composition" guide for more
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Drink } from "./TableDrinksColumns"
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
  id: number,
  drink: string
  price: number
}
const defaultDrinkInput: DrinkInput = {
  id: -1,
  drink: "",
  price: 0,
}

interface FormUpdateDrinkProps {
  updateDrink: (drink: Drink) => void;
  drink: Drink;
  setDrinkToUpdate: (drink: Drink | null) => void;
}


export const FormUpdateDrink = ({ updateDrink, drink, setDrinkToUpdate }: FormUpdateDrinkProps) => {
  let resetForm = false;
  if (defaultDrinkInput.id !== drink.id) {
    // Reset the form if the drink id changes
    // console.log("Resetting form")
    resetForm = true;
  }

  // Set the default values for the form
  defaultDrinkInput.id = drink.id
  defaultDrinkInput.drink = drink.name
  defaultDrinkInput.price = drink.price

  // Create the form instance
  const form = useAppForm({
    defaultValues: defaultDrinkInput,
    validators: {
      // Pass a schema or function to validate
      onChange: z.object({
        id: z.number(),
        drink: z.string(),
        price: z.number(),
      }),
    },
    onSubmit: ({value}) => {
      // alert(JSON.stringify(value, null, 2))
      updateDrink({
        id: drink.id,
        name: value.drink,
        price: value.price,
      });
      // Reset the form after submission
      setDrinkToUpdate(null);
    },
  })

  if (resetForm) {
    // Reset the form if the drink id changes
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
        <span className="text-cyan-500 font-extrabold">&gt;</span>
      &nbsp;&nbsp;Actualizar Bebida&nbsp;&nbsp;
        <span className="text-cyan-500 font-extrabold">&lt;</span>
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
        <form.Button className="mt-2 bg-cyan-500 hover:bg-cyan-600">Actualizar</form.Button>
      </form.AppForm>
      <Button className="mt-2 ml-2" variant={"outline"} onClick={(_) => setDrinkToUpdate(null)} >Cancelar</Button>
    </form>
  )
}
