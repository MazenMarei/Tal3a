import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import AuthenticatedPageLayout from '@/components/AuthenticatedPageLayout'

const isAuthenticated = () => {
  return true // Replace with actual authentication logic
}
export const Route = createFileRoute('/(authenticated)')({
  component: () => (
    <AuthenticatedPageLayout>
      <Outlet />
    </AuthenticatedPageLayout>
  ),

  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
})
