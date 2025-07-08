import { getUser, getUserRole } from "@/utils/getUser";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ResidentDashboard from "./resident";
import DispatcherDashboard from "./dispatcher";
import FirstResponderDashboard from "./firstresponder";
import { redirect } from "next/navigation";
import { MapPoint } from "@/app/components/map";
import { Database } from "@/utils/supabase/database.types";

export interface Fire {
  latitude: number;
  longitude: number;
  confidence: number;
  acq_date: string;
}

export interface FirstResponder {
  user_id: string;
  role: string;
  unit_name: string;
  distance: number;
  lat: number | null;
  lng: number | null;
}

async function getFires(): Promise<MapPoint[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("fires").select("*");
  if (error) {
    console.error("Error fetching fires:", error);
    return [];
  }
  const formattedFires: MapPoint[] = data.map(
    (fire: Database["public"]["Tables"]["fires"]["Row"]) => ({
      id: fire.id,
      lat: fire.latitude ?? 0,
      lng: fire.longitude ?? 0,
      type: "fire" as const,
      details: {
        title: `Fire ${fire.id}`,
        description: `Confidence: ${fire.confidence}%`,
        severity:
          fire.confidence === null
            ? "high"
            : fire.confidence >= 80
              ? "high"
              : fire.confidence >= 50
                ? "medium"
                : "low",
      },
    }),
  );
  console.log(formattedFires);
  return formattedFires;
}

async function getResponders(): Promise<FirstResponder[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("first_responders").select("*");
  if (error) {
    console.error("Error fetching responders:", error);
    return [];
  }
  return data.map((responder) => ({
    user_id: responder.user_id,
    role: responder.role,
    unit_name: responder.unit_name ?? "",
    distance: 0,
    lat: responder.lat,
    lng: responder.lng,
  }));
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
  const formattedFires = getFires();
  const center: [number, number] = [
    userRole.data.lat ?? 34.0522,
    userRole.data.lng ?? -118.2437,
  ];
  if (userRole.kind === "resident") {
    return (
      <ResidentDashboard formattedFires={formattedFires} center={center} />
    );
  } else if (userRole.kind === "dispatcher") {
    const allResponders = getResponders();
    return (
      <DispatcherDashboard
        formattedFires={formattedFires}
        center={center}
        allResponders={allResponders}
      />
    );
  } else {
    return (
      <FirstResponderDashboard
        formattedFires={formattedFires}
        center={center}
      />
    );
  }
}
