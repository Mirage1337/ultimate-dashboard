
"use client"

import { useState } from "react"
import { Receipt, Plus, Search, Edit2, MapPin, Calendar, MoreHorizontal, Trash2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Expense, Trip } from "@/lib/types"
import { addExpense, updateExpense, deleteExpense } from "@/app/dashboard/expenses/actions"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CategorySelect } from "@/components/kokonutui/category-select"

interface ExpensesContentProps {
  initialExpenses: Expense[]
  trips: Trip[]
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "flights":
    case "transport":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
    case "accommodation":
    case "hotel":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
    case "food":
    case "dining":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
    case "activities":
    case "entertainment":
      return "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400"
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
  }
}

export default function ExpensesContent({ initialExpenses, trips }: ExpensesContentProps) {
  const expenses = initialExpenses
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newExpenseCategory, setNewExpenseCategory] = useState("")
  const [editExpenseCategory, setEditExpenseCategory] = useState("")

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all-locations")
  const [selectedCategory, setSelectedCategory] = useState("all-categories")

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = selectedLocation === "all-locations" ||
      (expense.location && expense.location.toLowerCase() === selectedLocation) ||
      (expense.trip_id && trips.find(t => t.id === expense.trip_id)?.name.toLowerCase() === selectedLocation)
    const matchesCategory = selectedCategory === "all-categories" || (expense.category && expense.category.toLowerCase() === selectedCategory)
    return matchesSearch && matchesLocation && matchesCategory
  })

  // Extract unique locations and categories for filters
  const uniqueLocations = Array.from(new Set([
    ...expenses.map(e => e.location),
    ...trips.map(t => t.name)
  ].filter(Boolean))) as string[]

  const uniqueCategories = Array.from(new Set(expenses.map(e => e.category).filter(Boolean))) as string[]

  async function handleAddExpense(formData: FormData) {
    setIsLoading(true)

    // Look up location name if tripId is selected
    const tripId = formData.get("tripId") as string
    if (tripId) {
      const trip = trips.find(t => t.id === tripId)
      if (trip) {
        formData.append("location", trip.name)
      }
    }

    const result = await addExpense(formData)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Expense added successfully")
      setIsAddDialogOpen(false)
    }
  }

  async function handleUpdateExpense(formData: FormData) {
    setIsLoading(true)

    // Look up location name if tripId is selected
    const tripId = formData.get("tripId") as string
    if (tripId) {
      const trip = trips.find(t => t.id === tripId)
      if (trip) {
        formData.append("location", trip.name)
      }
    }

    const result = await updateExpense(formData)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Expense updated successfully")
      setIsEditDialogOpen(false)
      setSelectedExpense(null)
    }
  }

  async function handleDelete() {
    if (!selectedExpense) return

    setIsLoading(true)
    const result = await deleteExpense(selectedExpense.id)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Expense deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedExpense(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your travel expenses</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <form action={handleAddExpense} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" placeholder="e.g., Flight to Paris" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" name="amount" type="number" placeholder="0.00" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tripId">Trip / Location</Label>
                <Select name="tripId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {trips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id}>{trip.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <CategorySelect
                  value={newExpenseCategory}
                  onSelect={setNewExpenseCategory}
                />
                <input type="hidden" name="category" value={newExpenseCategory} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" name="notes" placeholder="Add any additional notes..." />
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Expense"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-4 border border-gray-200 dark:border-[#1F1F23]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search expenses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-locations">All Locations</SelectItem>
              {uniqueLocations.map((loc) => (
                <SelectItem key={loc} value={loc.toLowerCase()}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{filteredExpenses.length} expenses recorded</p>
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
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A1F] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
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
                        <DropdownMenuItem onClick={() => {
                          setSelectedExpense(expense)
                          setIsEditDialogOpen(true)
                        }}>
                          <Edit2 className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                          setSelectedExpense(expense)
                          setIsDeleteDialogOpen(true)
                        }}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No expenses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <form action={handleUpdateExpense} className="space-y-4 py-4">
              <input type="hidden" name="id" value={selectedExpense.id} />
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input id="edit-description" name="description" defaultValue={selectedExpense.description} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount</Label>
                  <Input id="edit-amount" name="amount" type="number" defaultValue={selectedExpense.amount} step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input id="edit-date" name="date" type="date" defaultValue={selectedExpense.date} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tripId">Trip / Location</Label>
                <Select name="tripId" defaultValue={selectedExpense.trip_id || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {trips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id}>{trip.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <CategorySelect
                  value={editExpenseCategory || selectedExpense.category || undefined}
                  onSelect={setEditExpenseCategory}
                />
                <input type="hidden" name="category" value={editExpenseCategory || selectedExpense.category || ''} />
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Expense"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense <strong>{selectedExpense?.description}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
