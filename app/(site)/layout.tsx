import { Toaster } from "sonner"
import { VendorTracker } from "@/components/site/vendor-tracker"
import { GclidTracker } from "@/components/site/gclid-tracker"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <VendorTracker />
      <GclidTracker />
      {children}
      <Toaster richColors position="top-right" />
    </>
  )
}
