"use server";

import {
  DispatcherData,
  FirstResponderData,
  getUser,
  getUserRole,
  ResidentData,
} from "@/utils/getUser";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { geocodeAddress, formatAddressForGeocoding } from "@/utils/mapbox";

export async function saveChanges(
  editData: ResidentData | DispatcherData | FirstResponderData,
) {
  console.log("Saving changes", editData);
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const user = await getUser(supabase);
  if (!user) {
    redirect("/login");
  }
  const userRole = await getUserRole(user, supabase);
  if (!userRole) {
    redirect("/onboarding");
  }
  let error;
  if (userRole.kind === "resident" && editData.kind === "resident") {
    // Geocode address if it has been updated
    const updateData = { ...editData.data };
    if (
      editData.data.street &&
      editData.data.city &&
      editData.data.state &&
      editData.data.zipcode
    ) {
      const fullAddress = formatAddressForGeocoding(
        editData.data.street,
        editData.data.city,
        editData.data.state,
        editData.data.zipcode,
      );
      const geocodeResult = await geocodeAddress(fullAddress);
      if (geocodeResult) {
        updateData.lat = geocodeResult.latitude;
        updateData.lng = geocodeResult.longitude;
      }
    }

    ({ error } = await supabase
      .from("at_risk")
      .update(updateData)
      .eq("user_id", user.id));
  } else if (userRole.kind === "dispatcher" && editData.kind === "dispatcher") {
    // Geocode location if state and zipcode are provided
    const updateData = { ...editData.data };
    if (editData.data.state && editData.data.zipcode) {
      const locationString = `${editData.data.zipcode}, ${editData.data.state}`;
      const geocodeResult = await geocodeAddress(locationString);
      if (geocodeResult) {
        updateData.lat = geocodeResult.latitude;
        updateData.lng = geocodeResult.longitude;
      }
    }

    ({ error } = await supabase
      .from("dispatchers")
      .update(updateData)
      .eq("user_id", user.id));
  } else if (
    userRole.kind === "first_responder" &&
    editData.kind === "first_responder"
  ) {
    // Geocode address if it has been updated
    const updateData = { ...editData.data };
    if (
      editData.data.street &&
      editData.data.city &&
      editData.data.state &&
      editData.data.zipcode
    ) {
      const fullAddress = formatAddressForGeocoding(
        editData.data.street,
        editData.data.city,
        editData.data.state,
        editData.data.zipcode,
      );
      const geocodeResult = await geocodeAddress(fullAddress);
      if (geocodeResult) {
        updateData.lat = geocodeResult.latitude;
        updateData.lng = geocodeResult.longitude;
      }
    }

    ({ error } = await supabase
      .from("first_responders")
      .update(updateData)
      .eq("user_id", user.id));
  }

  if (error) throw error;
  revalidatePath("/", "layout");
}
