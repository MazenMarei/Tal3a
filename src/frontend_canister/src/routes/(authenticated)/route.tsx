import AuthenticatedPageLayout from '@/components/AuthenticatedPageLayout'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import { useAppContext } from '@/contexts/AppProvider'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

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
