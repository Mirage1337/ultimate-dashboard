
"use client"

import { Receipt, Plus, Search, MoreHorizontal, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Expense } from "@/lib/types"

interface ExpensesContentProps {
  initialExpenses: Expense[]
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Flights":
    case "flights":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
    case "Accommodation":
    case "accommodation":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
    case "Food":
    case "food":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
    case "Transport":
    case "transport":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
    case "Activities":
    case "activities":
      return "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400"
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
  }
}

export default function ExpensesContent({ initialExpenses }: ExpensesContentProps) {
  const expenses = initialExpenses
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Extract unique locations and categories for filters
  const locations = ["All Locations", ...Array.from(new Set(expenses.map(e => e.location).filter(Boolean)))]
  const categories = ["All Categories", ...Array.from(new Set(expenses.map(e => e.category).filter(Boolean)))]

  // TODO: Implement Client-side filtering logic or server-side filtering
  // For now just displaying all

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your travel expenses</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Record a new travel expense and link it to a location.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="e.g., Flight to Paris" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tokyo">Tokyo, Japan</SelectItem>
                    <SelectItem value="paris">Paris, France</SelectItem>
                    <SelectItem value="barcelona">Barcelona, Spain</SelectItem>
                    <SelectItem value="bali">Bali, Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flights">Flights</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="activities">Activities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" placeholder="Add any additional notes..." />
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Add Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-4 border border-gray-200 dark:border-[#1F1F23]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search expenses..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={String(loc)} value={String(loc).toLowerCase().replace(/ /g, "-")}>
                  {String(loc)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={String(cat)} value={String(cat).toLowerCase().replace(/ /g, "-")}>
                  {String(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-5 border border-gray-200 dark:border-[#1F1F23]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">${totalExpenses.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
            <Receipt className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{expenses.length} expenses recorded</p>
      </div>

      {/* Expenses List */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#1F1F23] bg-gray-50 dark:bg-[#1A1A1F]">
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1F1F23]">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A1F] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                    {/* {expense.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{expense.notes}</p>
                    )} */}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-sm">{expense.location || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full ${getCategoryColor(expense.category || '')}`}>
                      {expense.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-sm">{expense.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${expense.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No expenses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
