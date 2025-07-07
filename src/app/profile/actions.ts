'use server';

import { DispatcherData, FirstResponderData, getUser, getUserRole, ResidentData } from "@/utils/getUser";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function saveChanges(editData: ResidentData | DispatcherData | FirstResponderData) {
    console.log('Saving changes', editData);
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const user = await getUser(supabase);
    if (!user) {
        redirect('/login');
    }
    const userRole = await getUserRole(user, supabase);
    if (!userRole) {
        redirect('/onboarding');
    }
    let error;
    if (userRole.kind === 'resident' && editData.kind === 'resident') {
        ({ error } = await supabase
          .from('at_risk')
          .update(editData.data)
          .eq('user_id', user.id));
      } else if (userRole.kind === 'dispatcher' && editData.kind === 'dispatcher') {
        ({ error } = await supabase
          .from('dispatchers')
          .update(editData.data)
          .eq('user_id', user.id));
      } else if (userRole.kind === 'first_responder' && editData.kind === 'first_responder') {
        ({ error } = await supabase
          .from('first_responders')
          .update(editData.data)
          .eq('user_id', user.id));
      }

      if (error) throw error;
      revalidatePath('/', 'layout');
}