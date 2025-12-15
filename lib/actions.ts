'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAccount(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const balance = parseFloat(formData.get('balance') as string)
    const currency = formData.get('currency') as string
    const institution = formData.get('institution') as string

    if (!name || !type || isNaN(balance) || !currency) {
        return { error: 'Please fill in all required fields' }
    }

    const { error } = await supabase.from('accounts').insert({
        name,
        type,
        balance,
        currency,
        // institution // Schema might not have this yet, checking types.ts it wasn't there but user had it in UI.
        // Based on types.ts: id, created_at, name, type, balance, currency.
        // Institution is not in Account type. I will omit it for now or check if I should add it.
        // The previous view_file of types.ts showed:
        // export type Account = { ... name, type, balance, currency }
        // no institution.
    })

    if (error) {
        console.error('Error adding account:', error)
        return { error: 'Failed to add account' }
    }

    revalidatePath('/dashboard/accounts')
    return { success: true }
}
