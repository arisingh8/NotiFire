import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.signOut();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: "User logged out successfully" });
}