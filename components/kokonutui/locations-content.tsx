
"use client"

import { MapPin, Plus, DollarSign, Calendar, MoreHorizontal } from "lucide-react"
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
import { addTrip, deleteTrip } from "@/app/dashboard/locations/actions"
import { toast } from "sonner" // Assuming sonner is available based on package.json, or use standard alert/console for now if not setup
import { useRouter } from "next/navigation"

export default function LocationsContent({ initialTrips }: LocationsContentProps) {
  const locations = initialTrips
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleAddTrip(formData: FormData) {
    setIsLoading(true)
    const result = await addTrip(formData)
    setIsLoading(false)

    if (result?.error) {
      alert(result.error) // Simple alert for now
    } else {
      setIsDialogOpen(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this trip?")) return
    const result = await deleteTrip(id)
    if (result?.error) {
      alert(result.error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Locations</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your travel destinations and budgets</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Input id="budget" name="budget" type="number" placeholder="0.00" required />
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
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Location"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(location.id)}>Delete</DropdownMenuItem>
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
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Budget Categories</h4>
                <div className="space-y-3">
                  {location.categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{category.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          ${category.actual.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {location.categories.length === 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">No categorized expenses yet.</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-6 pb-6">
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Update Actual Spent
                </Button>
              </div>
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
