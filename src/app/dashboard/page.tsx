import { getUser, getUserRole } from "@/utils/getUser";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ResidentDashboard from "./resident";
import DispatcherDashboard from "./dispatcher";
import FirstResponderDashboard from "./firstresponder";
import { redirect } from "next/navigation";
import Papa from "papaparse";
import { MapPoint } from "@/app/components/map";

export interface Fire {
    latitude: number;
    longitude: number;
    confidence: number;
    acq_date: string;
}

async function getFires(): Promise<Fire[]> {
    const endpoint = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${process.env.MAP_KEY}/MODIS_NRT/world/1`;

    const response = await fetch(endpoint, {cache: "force-cache", next: {revalidate: 3600}});
    const data = Papa.parse<Fire>(await response.text(), { 
        header: true,
        dynamicTyping: true,
    });
    return data.data;
}

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
    const fires = await getFires();
    const center: [number, number] = [userRole.data.lat ?? 34.0522, userRole.data.lng ?? -118.2437];
    const formattedFires: MapPoint[] = fires.map((fire: Fire, index: number) => ({
        id: index,
        lat: fire.latitude,
        lng: fire.longitude,
        type: "fire" as const,
        details: {
          title: `Fire ${index}`,
          description: `Confidence: ${fire.confidence}%`,
          severity:
            fire.confidence >= 80 ? "high" : fire.confidence >= 50 ? "medium" : "low",
        },
      }));
    if (userRole.kind === "resident") {
        return <ResidentDashboard fires={formattedFires} center={center} />;
    } else if (userRole.kind === "dispatcher") {
        return <DispatcherDashboard fires={formattedFires} center={center} />;
    } else {
        return <FirstResponderDashboard fires={formattedFires} center={center} />;
    }
}