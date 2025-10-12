import { createFileRoute } from '@tanstack/react-router'
import { FormLogin } from '@/components/FormLogin'
import logoAGA from "@/assets/Logo_AGA.png";


export const Route = createFileRoute('/login')({
  component: RouteComponent,
})


function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen m-0 p-0">
      <section className="flex flex-col max-w-200 md:w-9/12 w-11/12 bg-background dark:bg-neutral-800 rounded-lg shadow-md">
        <div className="flex items-center md:gap-7 gap-4 bg-neutral-700 dark:bg-neutral-900 text-white p-7 rounded-t-lg">
          <img className="h-15 ml-auto" src={logoAGA} alt="Logo" />
          <h1 className='md:text-4xl text-3xl mr-auto'>Productos AGA</h1>
        </div>
        <div className='mx-auto my-10'>
          <FormLogin makeLogin={(loginData) => { console.log(loginData) }} />
        </div>
      </section>
    </div>
  )
}
