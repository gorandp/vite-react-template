import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/Header'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <h3>Welcome Home!</h3>
      </div>
    )
}
