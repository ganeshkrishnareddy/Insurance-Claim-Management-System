import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmkqafvjoqcqqrvekzmg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impta3FhZnZqb3FjcXFydmVrem1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTQ2OTQsImV4cCI6MjA4NTE5MDY5NH0.i-I4yquhK1k9O1b_rP34Rnc9hc9o-LdbD8BtELHTDLA'

export const supabase = createClient(supabaseUrl, supabaseKey)
