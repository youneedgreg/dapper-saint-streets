import { supabase } from './supabase';

/**
 * Check if a user has a specific role
 */
export async function hasRole(userId: string, role: 'admin' | 'moderator' | 'user'): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', role)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(userId: string, profile: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get user's addresses
 */
export async function getUserAddresses(userId: string) {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Add user address
 */
export async function addUserAddress(userId: string, address: {
  label?: string;
  street: string;
  city: string;
  county?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
}) {
  // If this is set as default, unset other defaults first
  if (address.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: userId,
      ...address,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update user address
 */
export async function updateUserAddress(
  addressId: string,
  userId: string,
  updates: {
    label?: string;
    street?: string;
    city?: string;
    county?: string;
    postal_code?: string;
    country?: string;
    is_default?: boolean;
  }
) {
  // If this is set as default, unset other defaults first
  if (updates.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Delete user address
 */
export async function deleteUserAddress(addressId: string, userId: string) {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}

/**
 * Sign in with GitHub
 */
export async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}
