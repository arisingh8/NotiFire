'use server'

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers";
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/database.types";

export async function submitOnboardingForm(formData: FormData) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const userType = formData.get('userType') as string;

    try {
        if (userType === 'resident') {
            const data = {
                name: formData.get('name') as string,
                street: formData.get('street') as string,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                zipcode: formData.get('zipcode') as string,
                phone: formData.get('phone') as string,
                mobility_status: formData.get('mobility_status') as string,
                medical_needs: formData.get('medical_needs') as string || null,
                emergency_contact: formData.get('emergency_contact') as string,
                emergency_phone: formData.get('emergency_phone') as string,
                additional_info: formData.get('additional_info') as string || null,
                user_id: user.id
            };

            const { error } = await supabase
                .from('at_risk')
                .insert(data);

            if (error) throw error;

        } else if (userType === 'dispatcher') {
            const data = {
                name: formData.get('name') as string,
                state: formData.get('state') as string,
                zipcode: formData.get('zipcode') as string,
                authkey: formData.get('authkey') as string,
                dispatch_center: formData.get('dispatch_center') as string,
                dispatch_center_phone: formData.get('dispatch_center_phone') as string,
                user_id: user.id
            };

            const { error } = await supabase
                .from('dispatchers')
                .insert(data);

            if (error) throw error;

        } else if (userType === 'first_responder') {
            const data = {
                role: formData.get('role') as Database['public']['Enums']['first_responder_role'],
                unit_name: formData.get('unit_name') as string,
                street: formData.get('street') as string,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                zipcode: formData.get('zipcode') as string,
                unit_size: parseInt(formData.get('unit_size') as string),
                user_id: user.id
            };

            const { error } = await supabase
                .from('first_responders')
                .insert(data);

            if (error) throw error;
        }

        revalidatePath('/', 'layout');
    } catch (error) {
        console.error('Error submitting form:', error);
        redirect('/error');
    }
    redirect('/dashboard');
} 