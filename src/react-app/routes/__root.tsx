import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { buttonVariants } from "@/components/ui/button"
import logoTehuelches from "../assets/logo_tehuelches_transparent_background.png";


/* Styles */
const navButtonsClasses = (
    buttonVariants({})
    + " [&.active]:bg-transparent"
    + " [&.active]:border-2"
    + " [&.active]:border-orange-500");


export const Route = createRootRoute({
    component: () => (
        <div className="flex flex-col min-h-screen">
            <header className='
                    flex justify-between 
                    items-center bg-neutral-700
                    mb-5 py-7 xl:px-40 md:px-17 sm:px-10 px-5
                    text-white'>
                <div className="flex items-center mr-auto md:gap-7 gap-4">
                    <img className="h-15" src={logoTehuelches} alt="Logo" />
                    <h1 className='font-caesar-dressing md:text-4xl text-3xl'>Tehuelches SN</h1>
                </div>
                <div className="mr-0 ml-auto flex gap-3 sm:flex-row flex-col">
                    <Link to="/" className={navButtonsClasses}>
                        Inicio
                    </Link>
                    <Link to="/sales" className={navButtonsClasses}>
                        Ventas
                    </Link>
                    <Link to="/drinks" className={navButtonsClasses}>
                        Bebidas
                    </Link>
                </div>
            </header>
            <Outlet />
            <footer className='
                    flex justify-center 
                    items-center bg-neutral-700
                    mt-auto py-7
                    xl:px-40 md:px-17 sm:px-10 px-5
                    text-white'>
                {/* <h1 className='font-caesar-dressing md:text-4xl text-3xl'>Tehuelches SN</h1> */}
                <h1 className='font-caesar-dressing md:text-4xl text-3xl'>1%</h1>
            </footer>
            <TanStackRouterDevtools />
        </div>
    ),
})
