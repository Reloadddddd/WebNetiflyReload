"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

type AuthContextType = {
  session: Session | null
  user: User | null
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: async () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }

    getSession()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    session,
    user,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}