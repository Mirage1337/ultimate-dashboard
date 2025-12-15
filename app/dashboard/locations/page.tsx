export const dynamic = 'force-dynamic'

import LocationsContent from "@/components/kokonutui/locations-content"
import Layout from "@/components/kokonutui/layout"

export default async function LocationsPage() {
  const { getTrips } = await import("@/lib/data")
  const trips = await getTrips()

  return (
    <Layout>
      <LocationsContent initialTrips={trips} />
    </Layout>
  )
}
