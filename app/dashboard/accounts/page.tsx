export const dynamic = 'force-dynamic'

import AccountsContent from "@/components/kokonutui/accounts-content"
import Layout from "@/components/kokonutui/layout"

export default async function AccountsPage() {
  const { getAccounts } = await import("@/lib/data")
  const accounts = await getAccounts()

  return (
    <Layout>
      <AccountsContent initialAccounts={accounts} />
    </Layout>
  )
}
