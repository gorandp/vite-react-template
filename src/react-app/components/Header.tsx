import { Link } from '@tanstack/react-router'
import logoAGA from "../assets/Logo_AGA.png";
import { Button, buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/ThemeModeToggle"

/* Styles */
const navButtonsClasses = (
    buttonVariants({})
    + " [&.active]:bg-transparent"
    + " [&.active]:border-2"
    + " [&.active]:border-primary"
    + " [&.active]:text-primary"
    + " dark:[&.active]:text-white"
    + " text-white");


export const Header = () => {
    return (
      <header className='
                    flex justify-between 
                    items-center bg-background
                    dark:bg-background
                    mb-5 py-7 xl:px-40 md:px-17 sm:px-10 px-5
                    border-b-4 border-b-muted
                    '>
        <div className="flex items-center mr-auto md:gap-7 gap-4">
          <img className="h-15" src={logoAGA} alt="Logo" />
          <h1 className='md:text-4xl text-3xl'>Productos AGA</h1>
        </div>
        <div className="mr-0 ml-auto flex gap-3 sm:flex-row flex-col">
          <Link to="/" className={navButtonsClasses}>
            Inicio
          </Link>
          <Link to="/sales" className={navButtonsClasses}>
            Ventas
          </Link>
          <Link to="/products" className={navButtonsClasses}>
            Productos
          </Link>
          <ModeToggle />
          <Button variant="outline" onClick={() => {
            localStorage.removeItem('JWT_TOKEN');
            window.location.href = '/login';
          }}>
            Cerrar sesión
          </Button>
        </div>
      </header>
    )
}
