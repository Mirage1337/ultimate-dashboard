
export type Trip = {
    id: string
    created_at: string
    name: string
    budget: number
    status: 'active' | 'planned' | 'completed'
    start_date: string | null
    end_date: string | null
    image_url: string | null
    category_budgets: { name: string; amount: number }[] | null
}

export type Account = {
    id: string
    created_at: string
    name: string
    type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash'
    balance: number
    currency: string
}

export type Expense = {
    id: string
    created_at: string
    description: string
    amount: number
    date: string
    location: string | null
    category: string | null
    trip_id: string | null
}
