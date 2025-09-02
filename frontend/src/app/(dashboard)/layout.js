import AdminProtectedRoute from "@/components/AdminProtectedRoute"

export default function DashboardLayout({ children }) {
  return (
    <AdminProtectedRoute>
      {children}
    </AdminProtectedRoute>
  )
}
