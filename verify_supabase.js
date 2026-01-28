
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmkqafvjoqcqqrvekzmg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impta3FhZnZqb3FjcXFydmVrem1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTQ2OTQsImV4cCI6MjA4NTE5MDY5NH0.i-I4yquhK1k9O1b_rP34Rnc9hc9o-LdbD8BtELHTDLA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log("Testing Supabase Connection...");

    const testClaim = {
        patient: { name: "Test Script" },
        service_date: "2024-01-01",
        status: "draft"
    };

    const { data, error } = await supabase
        .from('claims')
        .insert([testClaim])
        .select();

    if (error) {
        console.error("❌ ERROR FAILED:");
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log("✅ SUCCESS! Inserted row:", data);

        // Clean up
        if (data && data[0] && data[0].id) {
            await supabase.from('claims').delete().eq('id', data[0].id);
            console.log("Cleaned up test row.");
        }
    }
}

testConnection();
