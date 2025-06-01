import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Get the user and check if they exist in our database
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      const user = session.user
      
      // Check if the user exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('discord_id', user.user_metadata.provider_id)
        .single()
      
      // If the user doesn't exist, create a new record
      if (!existingUser) {
        await supabase.from('users').insert({
          discord_id: user.user_metadata.provider_id,
          username: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
          role: 'user' // Default role for new users
        })
      }
    }
  }
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}