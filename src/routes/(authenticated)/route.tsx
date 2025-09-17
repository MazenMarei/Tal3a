import { createFileRoute, redirect } from '@tanstack/react-router'

const isAuthenticated = () => {
  return false // Replace with actual authentication logic
}
export const Route = createFileRoute('/(authenticated)')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
})
