export const dynamic = 'force-dynamic'

import ExpensesContent from "@/components/kokonutui/expenses-content"
import Layout from "@/components/kokonutui/layout"

export default async function ExpensesPage() {
  const { getExpensesList, getTrips } = await import("@/lib/data")
  const [expenses, trips] = await Promise.all([
    getExpensesList(),
    getTrips()
  ])

  return (
    <Layout>
      <ExpensesContent initialExpenses={expenses} trips={trips} />
    </Layout>
  )
}
