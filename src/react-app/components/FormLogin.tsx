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

interface LoginInput {
  username: string,
  password: string,
}
const defaultLoginInput: LoginInput = {
  username: "",
  password: "",
}

interface FormLoginProps {
  makeLogin: (credentials: LoginInput) => void;
}


export const FormLogin = ({ makeLogin }: FormLoginProps) => {
    const form = useAppForm({
      defaultValues: defaultLoginInput,
      validators: {
        // Pass a schema or function to validate
        onChange: z.object({
          username: z.string(),
          password: z.string(),
        }),
      },
      onSubmit: ({value}) => {
        // alert(JSON.stringify(value, null, 2))
        makeLogin(value);
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
            <span className="text-primary font-extrabold mr-10 sm:mr-25">&gt;</span>
          &nbsp;&nbsp;Iniciar Sesión&nbsp;&nbsp;
            <span className="text-primary font-extrabold ml-10 sm:ml-25">&lt;</span>
          </h1>
          {/* Components are bound to `form` and `field` to ensure extreme type safety */}
          {/* Use `form.AppField` to render a component bound to a single field */}
          <form.AppField
            name="username"
            children={(field) =>
              <label>
                <field.Input
                  className="mb-5"
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Usuario"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  />
              </label>
            }
          />
          <form.AppField
            name="password"
            children={(field) =>
              <label>
                <field.Input
                  className="mb-5"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Contraseña"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  />
              </label>
            }
          />
          <form.AppForm>
            <form.Button className="mt-2 w-full text-white">Enviar</form.Button>
          </form.AppForm>
        </form>
    )
}
