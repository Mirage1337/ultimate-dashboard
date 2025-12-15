
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addTrip(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('location') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const budget = parseFloat(formData.get('budget') as string)
    const status = formData.get('status') as string

    if (!name || isNaN(budget)) {
        return { error: 'Invalid data' }
    }

    const { error } = await supabase.from('trips').insert({
        name,
        start_date: startDate || null,
        end_date: endDate || null,
        budget,
        status
    })

    if (error) {
        console.error('Error adding trip:', error)
        return { error: 'Failed to add trip' }
    }

    revalidatePath('/dashboard/locations', 'page')
    return { success: true }
}

export async function deleteTrip(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('trips').delete().eq('id', id)

    if (error) {
        console.error('Error deleting trip:', error)
        return { error: 'Failed to delete trip' }
    }

    revalidatePath('/dashboard/locations', 'page')
    return { success: true }
}
