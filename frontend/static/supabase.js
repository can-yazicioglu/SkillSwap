import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const config = await fetch('/config').then(r => r.json());

export const supabase = createClient(config.supabase_url, config.supabase_key);