export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware cuida da autenticação — ver middleware.ts
  return <>{children}</>
}
