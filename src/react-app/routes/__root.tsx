import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import "./styles.css"
import logoTehuelches from "../assets/logo_tehuelches_transparent_background.png";

export const Route = createRootRoute({
    component: () => (
        <>
            <header>
                <div className="left-header">
                    <img className="logo" src={logoTehuelches} alt="Logo" />
                    <h1>Tehuelches ventas</h1>
                </div>
                <div className="right-header">
                    <Link to="/" className="nav-btn [&.active]:font-bold">
                        Inicio
                    </Link>{' '}
                    <Link to="/sales" className="nav-btn [&.active]:font-bold">
                        Ventas
                    </Link>{' '}
                    <Link to="/drinks" className="nav-btn [&.active]:font-bold">
                        Bebidas
                    </Link>
                </div>
            </header>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})
