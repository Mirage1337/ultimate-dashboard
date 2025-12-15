
import { Plane, MapPin, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getDashboardData } from "@/lib/data"

export default async function Content() {
  const { summary, recentLocations, accounts, recentExpenses } = await getDashboardData()

  const budgetRemaining = summary.totalBudget - summary.totalSpent
  const budgetPercentage = summary.totalBudget > 0
    ? (summary.totalSpent / summary.totalBudget) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Budget</span>
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <Wallet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            ${summary.totalBudget.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">For all trips</p>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            ${summary.totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{budgetPercentage.toFixed(0)}% of budget used</p>
        </div>

        {/* Remaining */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Remaining</span>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">${budgetRemaining.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available to spend</p>
        </div>

        {/* Trips */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Trips</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {summary.activeTrips} / {summary.upcomingTrips + summary.activeTrips}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active / Total planned</p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Overall Budget Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Spent: ${summary.totalSpent.toLocaleString()}</span>
            <span className="text-gray-600 dark:text-gray-400">
              Budget: ${summary.totalBudget.toLocaleString()}
            </span>
          </div>
          <Progress value={budgetPercentage} className="h-3" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(100 - budgetPercentage).toFixed(0)}% of budget remaining
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Locations */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Recent Locations
          </h2>
          <div className="space-y-4">
            {recentLocations.map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1F] rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{location.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${location.spent.toLocaleString()} / ${location.budget.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${location.status === "completed"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : location.status === "active"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                >
                  {location.status}
                </span>
              </div>
            ))}
            {recentLocations.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent trips found</p>
            )}
          </div>
        </div>

        {/* Accounts Summary */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Accounts Summary
          </h2>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1F] rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{account.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{account.type}</p>
                </div>
                <span
                  className={`font-semibold ${account.balance < 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}
                >
                  {account.balance < 0 ? "-" : ""}${Math.abs(account.balance).toLocaleString()}
                </span>
              </div>
            ))}
            {accounts.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No accounts found</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plane className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          Recent Expenses
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-[#1F1F23]">
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1F1F23]">
              {recentExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="py-3 text-gray-900 dark:text-white">{expense.description}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{expense.location || '-'}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{expense.date}</td>
                  <td className="py-3 text-right font-medium text-gray-900 dark:text-white">
                    ${expense.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {recentExpenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent expenses
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
