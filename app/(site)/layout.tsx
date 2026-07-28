import { Toaster } from "sonner"
import { VendorTracker } from "@/components/site/vendor-tracker"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <VendorTracker />
      {children}
      <Toaster richColors position="top-right" />
    </>
  )
}
