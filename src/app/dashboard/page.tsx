import { getUser, getUserRole } from "@/utils/getUser";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ResidentDashboard from "./resident";
import DispatcherDashboard from "./dispatcher";
import FirstResponderDashboard from "./firstresponder";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const user = await getUser(supabase);
    if (user === null) {
        redirect("/login");
    }
    const userRole = await getUserRole(user, supabase);
    if (userRole === null) {
        redirect("/onboarding");
    }
    if (userRole.kind === "resident") {
        return <ResidentDashboard />;
    } else if (userRole.kind === "dispatcher") {
        return <DispatcherDashboard />;
    } else {
        return <FirstResponderDashboard />;
    }
}