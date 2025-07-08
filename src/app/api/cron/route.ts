import { Fire } from "@/app/dashboard/page";
import { Database } from "@/utils/supabase/database.types";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const endpoint = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${process.env.MAP_KEY}/MODIS_NRT/world/2`;

  const response = await fetch(endpoint, { cache: "no-store" });
  const parsedData = Papa.parse<Fire>(await response.text(), {
    header: true,
    dynamicTyping: true,
  });

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
  const { data: _existingFires, error: existingFiresError } = await supabase
    .from("fires")
    .delete()
    .lte(
      "created_at",
      new Date(
        Date.now() -
          parseInt(process.env.FIRE_RETENTION_DAYS!) * 1000 * 60 * 60 * 24,
      ).toISOString(),
    );
  if (existingFiresError) {
    console.error("Error deleting existing fires:", existingFiresError);
    return NextResponse.json(
      { error: "Error deleting existing fires" },
      { status: 500 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = await supabase.from("fires").insert(
    parsedData.data.map((fire: Fire) => ({
      latitude: fire.latitude,
      longitude: fire.longitude,
      confidence: fire.confidence,
      acq_date: fire.acq_date,
    })),
  );

  if (error) {
    console.error("Error inserting fires:", error);
  }

  return NextResponse.json({ message: "Fires inserted successfully" });
}
