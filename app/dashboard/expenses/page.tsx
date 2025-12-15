export const dynamic = 'force-dynamic'

import ExpensesContent from "@/components/kokonutui/expenses-content"
import Layout from "@/components/kokonutui/layout"

export default async function ExpensesPage() {
  const { getExpensesList } = await import("@/lib/data")
  const expenses = await getExpensesList()

  return (
    <Layout>
      <ExpensesContent initialExpenses={expenses} />
    </Layout>
  )
}
