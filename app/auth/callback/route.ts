// Force le rendu dynamique pour éviter les erreurs de build avec Next.js
export const dynamic = "force-dynamic";

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Échange le code OAuth contre une session
    await supabase.auth.exchangeCodeForSession(code);

    // Récupère la session
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const user = session.user;

      // Vérifie si l'utilisateur existe déjà dans la table "users"
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('discord_id', user.user_metadata.provider_id)
        .single();

      // Si l'utilisateur n'existe pas, on l'ajoute
      if (!existingUser) {
        await supabase.from('users').insert({
          discord_id: user.user_metadata.provider_id,
          username: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
          role: 'user' // rôle par défaut
        });
      }
    }
  }

  // Redirige vers la page d'accueil une fois la connexion terminée
  return NextResponse.redirect(requestUrl.origin);
}
