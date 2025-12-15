

import { createClient } from '@/utils/supabase/server'
import { Trip, Account, Expense } from './types'
import { EXPENSE_CATEGORIES } from '@/lib/constants'

export async function getDashboardData() {
    const supabase = await createClient()
    // Fetch data in parallel
    const [tripsRes, accountsRes, expensesRes] = await Promise.all([
        supabase.from('trips').select('*').order('start_date', { ascending: false }),
        supabase.from('accounts').select('*').order('balance', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false })
    ])

    const trips = (tripsRes.data as Trip[]) || []
    const accounts = (accountsRes.data as Account[]) || []
    const expenses = (expensesRes.data as Expense[]) || []

    // Calculate Summary
    const tripsBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0)
    const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)

    const activeTrips = trips.filter(t => t.status === 'active').length
    const upcomingTrips = trips.filter(t => t.status === 'planned').length

    // Recent Locations (from trips)
    const recentLocations = trips.slice(0, 3).map(trip => {
        // Calculate spent per trip
        const tripExpenses = expenses.filter(e => e.trip_id === trip.id)
        const spent = tripExpenses.reduce((sum, e) => sum + e.amount, 0)

        return {
            id: trip.id,
            name: trip.name,
            budget: trip.budget,
            spent: spent,
            status: trip.status
        }
    })

    // Recent Expenses
    const recentExpenses = expenses.slice(0, 5)

    return {
        summary: {
            totalBudget: tripsBudget > 0 ? tripsBudget : 15000,
            totalSpent,
            activeTrips,
            upcomingTrips
        },
        recentLocations,
        recentExpenses,
        accounts
    }
}

export async function getAccounts() {
    const supabase = await createClient()
    const { data } = await supabase.from('accounts').select('*').order('name')
    return (data as Account[]) || []
}

export async function getBudgetMetrics() {
    const supabase = await createClient()
    const [tripsRes, expensesRes] = await Promise.all([
        supabase.from('trips').select('*').order('start_date', { ascending: false }),
        supabase.from('expenses').select('*')
    ])

    const trips = (tripsRes.data as Trip[]) || []
    const expenses = (expensesRes.data as Expense[]) || []

    const totalPlanned = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0)
    const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    const totalRemaining = totalPlanned - totalSpent

    // Location Budgets
    const locationBudgets = trips.map(trip => {
        const tripExpenses = expenses.filter(e => e.trip_id === trip.id)
        const spent = tripExpenses.reduce((sum, e) => sum + e.amount, 0)
        return {
            id: trip.id,
            name: trip.name,
            planned: trip.budget,
            spent: spent,
            status: trip.status
        }
    })

    // Category Breakdown
    // Group expenses by category
    const categoryMap = new Map<string, number>()
    expenses.forEach(exp => {
        const cat = exp.category || 'Uncategorized'
        const current = categoryMap.get(cat) || 0
        categoryMap.set(cat, current + exp.amount)
    })

    const categoryColors: Record<string, string> = {
        'Flights': 'bg-blue-500',
        'Transport': 'bg-blue-500',
        'Accommodation': 'bg-purple-500',
        'Food': 'bg-orange-500',
        'Activities': 'bg-pink-500',
        'Shopping': 'bg-red-500',
        'Uncategorized': 'bg-gray-500'
    }

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, spent]) => ({
        name,
        spent,
        planned: 0, // We don't have category budgets in schema yet, so just show spent or 0
        color: categoryColors[name] || 'bg-gray-500'
    })).sort((a, b) => b.spent - a.spent)

    return {
        budgetOverview: {
            totalPlanned,
            totalSpent,
            totalRemaining
        },
        locationBudgets,
        categoryBreakdown
    }
}

export async function getExpensesList() {
    const supabase = await createClient()
    const { data } = await supabase.from('expenses').select('*').order('date', { ascending: false })
    return (data as Expense[]) || []
}

export async function getTrips() {
    const supabase = await createClient()
    const [tripsRes, expensesRes] = await Promise.all([
        supabase.from('trips').select('*').order('start_date', { ascending: false }),
        supabase.from('expenses').select('*')
    ])

    const trips = (tripsRes.data as Trip[]) || []
    const expenses = (expensesRes.data as Expense[]) || []

    return trips.map(trip => {
        const tripExpenses = expenses.filter(e => e.trip_id === trip.id)
        const actualSpent = tripExpenses.reduce((sum, e) => sum + e.amount, 0)

        // Calculate category breakdown for this trip
        const categoryMap = new Map<string, { actual: number; planned: number }>()

        // Initialize with planned budgets
        if (trip.category_budgets) {
            trip.category_budgets.forEach(cat => {
                categoryMap.set(cat.name, { actual: 0, planned: cat.amount })
            })
        }

        // Add expenses
        tripExpenses.forEach(exp => {
            let cat = exp.category || 'Uncategorized'

            // Check if this category exists in our budget map
            if (!categoryMap.has(cat)) {
                // If not, try to find if it belongs to a parent group that IS in the budget map
                // Iterate over EXPENSE_CATEGORIES to find the parent group
                for (const [group, items] of Object.entries(EXPENSE_CATEGORIES)) {
                    if (items.some(item => item.label === cat)) {
                        // Found the parent group
                        if (categoryMap.has(group)) {
                            // If the parent group is tracked in our budget, attribute this expense to it
                            cat = group
                        }
                        break
                    }
                }
            }

            const current = categoryMap.get(cat) || { actual: 0, planned: 0 }
            categoryMap.set(cat, { ...current, actual: current.actual + exp.amount })
        })

        const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
            name,
            planned: data.planned,
            actual: data.actual
        })).sort((a, b) => (b.planned + b.actual) - (a.planned + a.actual))

        return {
            ...trip,
            actualSpent,
            categories
        }
    })
}
