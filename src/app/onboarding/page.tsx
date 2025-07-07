import { getUser, getUserRole } from "@/utils/getUser";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function Onboarding() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const user = await getUser(supabase);
    
    if (user === null) {
        redirect("/login");
    }
    
    const userRole = await getUserRole(user, supabase);
    if (userRole !== null) {
        redirect("/dashboard");
    }

    return <OnboardingForm />;
}