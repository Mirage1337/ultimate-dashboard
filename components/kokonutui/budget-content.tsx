
"use client"

import { PiggyBank, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface BudgetOverview {
  totalPlanned: number
  totalSpent: number
  totalRemaining: number
}

interface LocationBudget {
  id: string
  name: string
  planned: number
  spent: number
  status: string
}

interface CategoryBreakdown {
  name: string
  spent: number
  planned: number
  color: string
}

interface BudgetContentProps {
  budgetOverview: BudgetOverview
  locationBudgets: LocationBudget[]
  categoryBreakdown: CategoryBreakdown[]
}

export default function BudgetContent({ budgetOverview, locationBudgets, categoryBreakdown }: BudgetContentProps) {
  const overallPercentage = budgetOverview.totalPlanned > 0
    ? (budgetOverview.totalSpent / budgetOverview.totalPlanned) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your travel budget across all destinations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Planned</span>
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <PiggyBank className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            ${budgetOverview.totalPlanned.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across all trips</p>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            ${budgetOverview.totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{overallPercentage.toFixed(0)}% of budget</p>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Remaining</span>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            ${budgetOverview.totalRemaining.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available to spend</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Overall Budget Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              ${budgetOverview.totalSpent.toLocaleString()} spent
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              ${budgetOverview.totalPlanned.toLocaleString()} planned
            </span>
          </div>
          <Progress value={overallPercentage} className="h-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {(100 - overallPercentage).toFixed(0)}% of your total budget remaining
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget by Location */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Budget by Location</h2>
          <div className="space-y-5">
            {locationBudgets.map((location) => {
              const percentage = location.planned > 0
                ? (location.spent / location.planned) * 100
                : location.spent > 0 ? 100 : 0
              const isOverBudget = location.spent > location.planned

              return (
                <div key={location.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{location.name}</span>
                      {isOverBudget && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ${location.spent.toLocaleString()} / ${location.planned.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={`h-2 ${isOverBudget ? "[&>div]:bg-red-500" : ""}`}
                  />
                </div>
              )
            })}
            {locationBudgets.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No trips found.</p>
            )}
          </div>
        </div>

        {/* Budget by Category */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Budget by Category</h2>
          <div className="space-y-5">
            {categoryBreakdown.map((category) => {
              // Since we don't have planned budget for categories yet, we can't show percentage properly
              // For now, let's just make it full or proportional if we had a total? 
              // The original UI showed progress. 
              // A simple way is to show % of Total Spent? Or just a visual bar?
              // Let's just use 0 for now or hide the progress bar if planned is 0.

              // Or better: Let's assume the user wants to see relative spending.
              // percentage of total spent?
              // The previous code had "planned" vs "spent". 
              // Let's keep the bar but full? Or maybe just hide it.
              // Let's hide the progress bar if planned is 0 to avoid confusion.

              const percentage = category.planned > 0
                ? (category.spent / category.planned) * 100
                : 0

              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ${category.spent.toLocaleString()}
                      {category.planned > 0 && ` / ${category.planned.toLocaleString()}`}
                    </span>
                  </div>
                  {/* <Progress value={percentage} className="h-2" /> */}
                </div>
              )
            })}
            {categoryBreakdown.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No expenses found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
