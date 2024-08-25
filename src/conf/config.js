const config = {
  supabaseUrl: String(import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: String(import.meta.env.VITE_SUPABASE_ANON_KEY),
  clerkPublishableKey: String(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY),
};

export default config;
