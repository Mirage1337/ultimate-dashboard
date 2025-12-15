export const dynamic = 'force-dynamic'

import BudgetContent from "@/components/kokonutui/budget-content"
import Layout from "@/components/kokonutui/layout"

export default async function BudgetPage() {
  const { getBudgetMetrics } = await import("@/lib/data")
  const { budgetOverview, locationBudgets, categoryBreakdown } = await getBudgetMetrics()

  return (
    <Layout>
      <BudgetContent
        budgetOverview={budgetOverview}
        locationBudgets={locationBudgets}
        categoryBreakdown={categoryBreakdown}
      />
    </Layout>
  )
}
