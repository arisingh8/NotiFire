import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
        return NextResponse.json({ role: "NA" });
    }

    const userId = userData.user.id;

    try {
        // Check if user is in at_risk table (resident)
        const { count: atRiskCount, error: atRiskError } = await supabase
            .from("at_risk")
            .select("*", { count: "exact" })
            .eq("user_id", userId);

        if (atRiskError) {
            console.error("Error checking at_risk table:", atRiskError);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        if (atRiskCount && atRiskCount > 0) {
            return NextResponse.json({ role: "resident" });
        }

        // Check if user is in dispatchers table
        const { count: dispatcherCount, error: dispatcherError } = await supabase
            .from("dispatchers")
            .select("*", { count: "exact" })
            .eq("user_id", userId);

        if (dispatcherError) {
            console.error("Error checking dispatchers table:", dispatcherError);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        if (dispatcherCount && dispatcherCount > 0) {
            return NextResponse.json({ role: "dispatcher" });
        }

        // Default to first_responder if not found in other tables
        return NextResponse.json({ role: "first_responder" });
    } catch (error) {
        console.error("Unexpected error in role check:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}