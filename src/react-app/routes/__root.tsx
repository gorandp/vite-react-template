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
        <>
            <header className='
                    flex justify-between 
                    items-center bg-neutral-700
                    py-7 xl:px-40 md:px-17 sm:px-10
                    text-white'>
                <div className="flex items-center mr-auto gap-7">
                    <img className="h-15" src={logoTehuelches} alt="Logo" />
                    <h1 className='text-xl'>Tehuelches ventas</h1>
                </div>
                <div className="mr-0 ml-auto flex gap-3">
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
            <TanStackRouterDevtools />
        </>
    ),
})
