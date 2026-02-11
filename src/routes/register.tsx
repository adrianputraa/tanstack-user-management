import RegisterForm from '@/components/form/register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  )
}
