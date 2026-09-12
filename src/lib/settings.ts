// src/lib/settings.ts
import { supabase } from "@/integrations/supabase/client";

export async function getWhatsappNumber() {
  const { data, error } = await supabase
    .from("settings")
    .select("whatsapp_number, announcement_text")
    .eq("id", 1)
    .maybeSingle();

  if (error) console.error("Settings fetch error:", error);
  
  return {
    whatsapp: data?.whatsapp_number || "", // empty if not found, no hardcode
    announcement: data?.announcement_text || ""
  };
}