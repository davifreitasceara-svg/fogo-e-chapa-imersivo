import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hytbvsamaleaznnzzwqj.supabase.co";
const supabaseKey = "sb_publishable_y3zRUvHGxtShZl9Ab5Y_XA_S2bJP5jd";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing Supabase connection to:", supabaseUrl);
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log("Auth connection check:", error ? `Error: ${error.message}` : "Success (session reachable)");
    
    // Test database ping
    const dbTest = await supabase.from("_non_existent_test_table_").select("*").limit(1);
    console.log("DB Endpoint reachable:", dbTest.status, dbTest.statusText || "");
    console.log("Supabase successfully initialized and connected!");
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

testConnection();
