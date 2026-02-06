"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestSupabase() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Supabase Connection Test</h1>
      <p>Check browser console</p>
    </div>
  );
}
