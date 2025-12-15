"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addExpense(formData: FormData) {
    const supabase = await createClient()

    const description = formData.get("description") as string
    const amount = parseFloat(formData.get("amount") as string)
    const date = formData.get("date") as string
    const category = formData.get("category") as string
    const tripId = formData.get("tripId") as string
    const location = formData.get("location") as string // Fallback or separate field if not linked to trip

    // If tripId is provided, we can fetch the location name from the trip if needed, 
    // or just trust the user selected location. 
    // For now, we will store what was passed.

    if (!description || isNaN(amount) || !date) {
        return { error: "Invalid data. Please check description, amount, and date." }
    }

    const { error } = await supabase.from("expenses").insert({
        description,
        amount,
        date,
        category,
        trip_id: tripId || null,
        location: location || null
    })

    if (error) {
        console.error("Error adding expense:", error)
        return { error: "Failed to add expense" }
    }

    revalidatePath("/dashboard/expenses")
    revalidatePath("/dashboard") // Update dashboard totals
    return { success: true }
}

export async function updateExpense(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get("id") as string
    const description = formData.get("description") as string
    const amount = parseFloat(formData.get("amount") as string)
    const date = formData.get("date") as string
    const category = formData.get("category") as string
    const tripId = formData.get("tripId") as string
    const location = formData.get("location") as string

    if (!id || !description || isNaN(amount)) {
        return { error: "Invalid data" }
    }

    const { error } = await supabase.from("expenses").update({
        description,
        amount,
        date,
        category,
        trip_id: tripId || null,
        location: location || null
    }).eq("id", id)

    if (error) {
        console.error("Error updating expense:", error)
        return { error: "Failed to update expense" }
    }

    revalidatePath("/dashboard/expenses")
    revalidatePath("/dashboard")
    return { success: true }
}

export async function deleteExpense(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from("expenses").delete().eq("id", id)

    if (error) {
        console.error("Error deleting expense:", error)
        return { error: "Failed to delete expense" }
    }

    revalidatePath("/dashboard/expenses")
    revalidatePath("/dashboard")
    return { success: true }
}
