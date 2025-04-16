class SupabaseService {
  constructor() {
    this.client = supabase.createClient(
      'https://wmjejaorufcvbmdhxsjy.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtamVqYW9ydWZjdmJtZGh4c2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDEzNzIsImV4cCI6MjA2MDMxNzM3Mn0.oHdXpUC1eIuLBelJZsNFZPq2Q3SLOGwxBfntGAe4jxw'
    );
  }

  async signIn(email, password) {
    return await this.client.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return await this.client.auth.signOut();
  }

  async createUserWithRole(email, password, fullName, userType) {
    const { data: authData, error: authError } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, user_role: userType }
      }
    });
    
    if (authError) throw authError;

    const { error: dbError } = await this.client
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        user_type: userType
      });

    if (dbError) throw dbError;

    return authData.user;
  }

  async getUsers(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    return await this.client
      .from('users')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });
  }
}
