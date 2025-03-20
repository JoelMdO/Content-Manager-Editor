import { supabase } from "./supabase_client";

const supabaseAuth = async (email: string, password: string): Promise<any> => {
     supabase.auth.signInWithPassword({
            email,
            password,
        });
}

export default supabaseAuth;