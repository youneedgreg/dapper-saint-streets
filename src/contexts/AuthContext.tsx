import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string }
  ) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
  updateProfile: (data: {
    first_name?: string
    last_name?: string
    phone?: string
    avatar_url?: string
  }) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  // 🔑 Single loading state: true until initAuth completes
  const [authLoading, setAuthLoading] = useState(true)
  const [roleLoading, setRoleLoading] = useState(true)

  const [isAdmin, setIsAdmin] = useState(false)
  
  // Track if initAuth has completed to avoid onAuthStateChange interfering
  const [initAuthCompleted, setInitAuthCompleted] = useState(false)

  // ---------------------------
  // Load admin role (shared by bootstrap and updates)
  // ---------------------------
  const loadAdminRole = async (userId: string) => {
    setRoleLoading(true)

    try {
      // Create abort controller with 5-second timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.warn('[AuthContext] loadAdminRole: timeout after 5s')
        controller.abort()
      }, 5000)
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single()
      
      clearTimeout(timeoutId)
      
      if (error) {
        console.warn('[AuthContext] loadAdminRole: error', error.message)
      }
      
      setIsAdmin(!error && !!data)
    } catch (err) {
      console.error('[AuthContext] loadAdminRole: exception', err instanceof Error ? err.message : String(err))
      setIsAdmin(false)
    } finally {
      setRoleLoading(false)
    }
  }

  // ---------------------------
  // Bootstrap auth on app load (SINGLE source of truth)
  // ---------------------------
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error || !data.session) {
        setUser(null)
        setSession(null)
        setIsAdmin(false)
        setRoleLoading(false)
        setInitAuthCompleted(true)
        setAuthLoading(false)
        return
      }

      setSession(data.session)
      setUser(data.session.user)

      // Load role and let it set roleLoading=false when done
      await loadAdminRole(data.session.user.id)
      setInitAuthCompleted(true)
      setAuthLoading(false)
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, [])

  // ---------------------------
  // Listen to auth changes (only updates, never controls loading on init)
  // ---------------------------
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // If initAuth hasn't completed, don't update state—let it own the bootstrap
        if (!initAuthCompleted) {
          return
        }

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadAdminRole(session.user.id)
        } else {
          setIsAdmin(false)
          setRoleLoading(false)
        }
      }
    )

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  // ---------------------------
  // Auth actions
  // ---------------------------
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('[AuthContext] signIn: error', error.message)
    }
    return { error }
  }

  const signUp = async (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    if (error) {
      console.error('[AuthContext] signUp: error', error.message)
    }
    return { error }
  }

  const signOut = async () => {
    setAuthLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsAdmin(false)
    setAuthLoading(false)
    setRoleLoading(false)
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      console.error('[AuthContext] resetPassword: error', error.message)
    }
    return { error }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      console.error('[AuthContext] updatePassword: error', error.message)
    }
    return { error }
  }

  const updateProfile = async (data: {
    first_name?: string
    last_name?: string
    phone?: string
    avatar_url?: string
  }) => {
    if (!user) return { error: new Error('No user logged in') }

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
    if (error) {
      console.error('[AuthContext] updateProfile: error', error.message)
    }
    return { error }
  }

  const value: AuthContextType = {
    user,
    session,
    isAdmin,
    loading: authLoading || roleLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
