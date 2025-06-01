export const dynamic = "force-dynamic"; // ⬅️ Ajouté ici pour empêcher le rendu statique

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
      co
