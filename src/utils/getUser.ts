import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase/database.types";

export type ResidentData = {
  kind: "resident";
  data: Database["public"]["Tables"]["at_risk"]["Row"];
};
export type DispatcherData = {
  kind: "dispatcher";
  data: Database["public"]["Tables"]["dispatchers"]["Row"];
};
export type FirstResponderData = {
  kind: "first_responder";
  data: Database["public"]["Tables"]["first_responders"]["Row"];
};

export const getUser = async (
  supabase: SupabaseClient<Database>,
): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getUserRole = async (
  user: User,
  supabase: SupabaseClient<Database>,
): Promise<ResidentData | DispatcherData | FirstResponderData | null> => {
  // Check if user is in at_risk table (resident)
  const { data: atRiskData } = await supabase
    .from("at_risk")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .single();

  if (atRiskData) {
    return {
      kind: "resident",
      data: atRiskData,
    };
  }

  // Check if user is in dispatchers table
  const { data: dispatcherData } = await supabase
    .from("dispatchers")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .single();

  if (dispatcherData) {
    return {
      kind: "dispatcher",
      data: dispatcherData,
    };
  }

  // Check if user is in first_responders table
  const { data: firstResponderData } = await supabase
    .from("first_responders")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .single();

  if (firstResponderData) {
    return {
      kind: "first_responder",
      data: firstResponderData,
    };
  }

  return null;
};
