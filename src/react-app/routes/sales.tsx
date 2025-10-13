import { createFileRoute, redirect } from '@tanstack/react-router'
import { Header } from '@/components/Header'

import { FormAddSale } from '@/components/FormAddSale'


export const Route = createFileRoute('/sales')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (!localStorage.getItem('JWT_TOKEN')) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      })
    }
  },
})


function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <h3>Hello "/sales"!</h3>
      <FormAddSale addSale={(_) => {}} />
    </div>
  )
}
