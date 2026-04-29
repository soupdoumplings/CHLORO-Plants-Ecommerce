import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSearch() {
  const q = 'monstera';
  console.log(`Searching for: ${q}`);
  const { data, error } = await supabase
    .from('products')
    .select('id, name')
    .ilike('name', `%${q}%`);
    
  if (error) console.error("Error:", error);
  else console.log("Results ilike:", data);
  
  // also get all names
  const { data: all } = await supabase.from('products').select('name');
  console.log("All names:", all?.map(p => p.name));
}

testSearch();
