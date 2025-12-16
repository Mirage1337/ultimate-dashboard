
"use client"

import { MapPin, Plus, DollarSign, Calendar, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
import { Trip } from "@/lib/types"

interface CategoryBreakdown {
  name: string
  planned: number
  actual: number
}

interface TripWithMetrics extends Trip {
  actualSpent: number
  categories: CategoryBreakdown[]
}

interface LocationsContentProps {
  initialTrips: TripWithMetrics[]
}

import { useState } from "react"
import { addTrip, updateTrip, deleteTrip } from "@/app/dashboard/locations/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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

export default function LocationsContent({ initialTrips }: LocationsContentProps) {
  const locations = initialTrips
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [selectedTrip, setSelectedTrip] = useState<TripWithMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [categoryBudgets, setCategoryBudgets] = useState<{ name: string; amount: string }[]>([
    { name: "Auto & Transport", amount: "" },
    { name: "Food & Dining", amount: "" },
    { name: "Accommodation", amount: "" }
  ])
  const [editCategoryBudgets, setEditCategoryBudgets] = useState<{ name: string; amount: string }[]>([])

  function addCategory(isEdit = false) {
    if (isEdit) {
      setEditCategoryBudgets([...editCategoryBudgets, { name: "", amount: "" }])
    } else {
      setCategoryBudgets([...categoryBudgets, { name: "", amount: "" }])
    }
  }

  function removeCategory(index: number, isEdit = false) {
    if (isEdit) {
      setEditCategoryBudgets(editCategoryBudgets.filter((_, i) => i !== index))
    } else {
      setCategoryBudgets(categoryBudgets.filter((_, i) => i !== index))
    }
  }

  function updateCategory(index: number, field: "name" | "amount", value: string, isEdit = false) {
    if (isEdit) {
      const newBudgets = [...editCategoryBudgets]
      newBudgets[index] = { ...newBudgets[index], [field]: value }
      setEditCategoryBudgets(newBudgets)
    } else {
      const newBudgets = [...categoryBudgets]
      newBudgets[index] = { ...newBudgets[index], [field]: value }
      setCategoryBudgets(newBudgets)
    }
  }

  async function handleAddTrip(formData: FormData) {
    setIsLoading(true)
    const result = await addTrip(formData)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Location added successfully")
      setIsAddDialogOpen(false)
      setCategoryBudgets([
        { name: "Auto & Transport", amount: "" },
        { name: "Food & Dining", amount: "" },
        { name: "Accommodation", amount: "" }
      ])
    }
  }

  async function handleUpdateTrip(formData: FormData) {
    setIsLoading(true)
    const result = await updateTrip(formData)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Location updated successfully")
      setIsEditDialogOpen(false)
      setSelectedTrip(null)
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteTrip(id)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Location deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedTrip(null)
    }
  }

  function openEdit(trip: TripWithMetrics) {
    setSelectedTrip(trip)
    setEditCategoryBudgets(
      trip.categories.map(c => ({ name: c.name, amount: c.planned.toString() }))
    )
    setIsEditDialogOpen(true)
  }

  function openView(trip: TripWithMetrics) {
    setSelectedTrip(trip)
    setIsViewDialogOpen(true)
  }

  function openDelete(trip: TripWithMetrics) {
    setSelectedTrip(trip)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Locations</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your travel destinations and budgets</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>Add a new travel destination with your planned budget.</DialogDescription>
            </DialogHeader>
            <form action={handleAddTrip} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location Name</Label>
                <Input id="location" name="location" placeholder="e.g., Tokyo, Japan" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Planned Budget</Label>
                <Input id="budget" name="budget" type="number" placeholder="0.00" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="planned">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Categories */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Budget Categories</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addCategory(false)}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {categoryBudgets.map((cat, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <CategorySelect
                          value={cat.name}
                          onSelect={(value) => updateCategory(index, "name", value, false)}
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={cat.amount}
                        onChange={(e) => updateCategory(index, "amount", e.target.value, false)}
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeCategory(index, false)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {categoryBudgets.length === 0 && (
                    <p className="text-xs text-center text-gray-500 py-2">No categories defined</p>
                  )}
                </div>
                <input
                  type="hidden"
                  name="categoryBudgets"
                  value={JSON.stringify(categoryBudgets.map(c => ({ name: c.name, amount: parseFloat(c.amount) || 0 })))}
                />
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Location"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>Update the details for this trip.</DialogDescription>
            </DialogHeader>
            {selectedTrip && (
              <form action={handleUpdateTrip} className="space-y-4 py-4">
                <input type="hidden" name="id" value={selectedTrip.id} />
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location Name</Label>
                  <Input id="edit-location" name="location" defaultValue={selectedTrip.name} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input id="edit-startDate" name="startDate" type="date" defaultValue={selectedTrip.start_date || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input id="edit-endDate" name="endDate" type="date" defaultValue={selectedTrip.end_date || ''} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Planned Budget</Label>
                  <Input id="edit-budget" name="budget" type="number" defaultValue={selectedTrip.budget} step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={selectedTrip.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Edit Budget Categories */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label>Budget Categories</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addCategory(true)}>
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editCategoryBudgets.map((cat, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <CategorySelect
                            value={cat.name}
                            onSelect={(value) => updateCategory(index, "name", value, true)}
                          />
                        </div>
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={cat.amount}
                          onChange={(e) => updateCategory(index, "amount", e.target.value, true)}
                          className="w-24"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeCategory(index, true)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {editCategoryBudgets.length === 0 && (
                      <p className="text-xs text-center text-gray-500 py-2">No categories defined</p>
                    )}
                  </div>
                  <input
                    type="hidden"
                    name="categoryBudgets"
                    value={JSON.stringify(editCategoryBudgets.map(c => ({ name: c.name, amount: parseFloat(c.amount) || 0 })))}
                  />
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Location"}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Trip Details</DialogTitle>
            </DialogHeader>
            {selectedTrip && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Location</Label>
                    <p className="font-medium">{selectedTrip.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <p className="capitalize">{selectedTrip.status}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Dates</Label>
                    <p>{selectedTrip.start_date || 'TBD'} - {selectedTrip.end_date || 'TBD'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Budget</Label>
                    <p>${selectedTrip.budget?.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Actual Spent</Label>
                    <p>${selectedTrip.actualSpent?.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Categories</Label>
                  <div className="space-y-2">
                    {selectedTrip.categories.map((cat) => (
                      <div key={cat.name} className="flex flex-col text-sm border-b border-dashed border-gray-100 dark:border-gray-800 pb-2 mb-2 last:border-0">
                        <div className="flex justify-between font-medium">
                          <span>{cat.name}</span>
                          <span>${cat.planned.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Actual: ${cat.actual.toLocaleString()}</span>
                          <span className={cat.actual > cat.planned ? "text-red-500" : "text-green-500"}>
                            {cat.actual > cat.planned ? "+" : ""}${(cat.actual - cat.planned).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {selectedTrip.categories.length === 0 && <p className="text-sm text-gray-400">No budget categories defined.</p>}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Alert Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the trip inside <strong>{selectedTrip?.name}</strong> and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => selectedTrip && handleDelete(selectedTrip.id)} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {locations.map((location) => {
          const plannedBudget = location.budget || 0
          const spentPercentage = plannedBudget > 0 ? (location.actualSpent / plannedBudget) * 100 : 0
          const isOverBudget = location.actualSpent > plannedBudget

          return (
            <div
              key={location.id}
              className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100 dark:border-[#1F1F23]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                      <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{location.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {location.start_date || 'TBD'} - {location.end_date || 'TBD'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault()
                            openEdit(location)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault()
                            openView(location)
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.preventDefault()
                            openDelete(location)
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Budget Overview */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Spent: ${location.actualSpent.toLocaleString()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Budget: ${plannedBudget.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(spentPercentage, 100)}
                    className={`h-2 ${isOverBudget ? "[&>div]:bg-red-500" : ""}`}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isOverBudget
                      ? `Over budget by $${(location.actualSpent - plannedBudget).toLocaleString()}`
                      : `$${(plannedBudget - location.actualSpent).toLocaleString()} remaining`}
                  </p>
                </div>
              </div>

              {/* Categories Breakdown */}
              <div className="p-6">
                <div className="space-y-3">
                  {/* Category Header */}
                  <div className="grid grid-cols-[1fr_100px_100px] gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Categories</span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-right uppercase">Planned</span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-right uppercase">Actual</span>
                  </div>

                  {location.categories.map((category) => {
                    const isOver = category.actual > category.planned
                    return (
                      <div key={category.name} className="grid grid-cols-[1fr_100px_100px] gap-2 items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate pr-2">{category.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-500 text-right">
                          ${category.planned.toLocaleString()}
                        </span>
                        <span className={`text-sm text-right font-medium ${isOver ? "text-red-500" : "text-green-500"}`}>
                          ${category.actual.toLocaleString()}
                        </span>
                      </div>
                    )
                  })}
                  {location.categories.length === 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">No categorized expenses yet.</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}

            </div>
          )
        })}
        {locations.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
            No trips found. Add a new location to get started.
          </div>
        )}
      </div>
    </div>
  )
}
