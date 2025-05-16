import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'


export const Route = createFileRoute('/sales')({
  component: RouteComponent,
})


function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <h3>Hello "/sales"!</h3>
      <Footer />
    </div>
  )
}
