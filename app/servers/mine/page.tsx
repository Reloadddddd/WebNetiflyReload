import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import { UserServers } from '@/components/user-servers'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'My Servers | Discord Directory',
  description: 'Manage your Discord servers',
}

export default async function MyServersPage() {
  // In a real implementation, you would use Supabase Auth Helpers to verify the session
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Redirect if not logged in (this should be handled by middleware, but adding extra protection)
  if (!session) {
    redirect('/')
  }
  
  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Servers</h1>
          <p className="text-muted-foreground">
            Manage the Discord servers you&apos;ve added to the directory
          </p>
        </div>
        <Button asChild>
          <Link href="/servers/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Server
          </Link>
        </Button>
      </div>
      
      <UserServers userId={session.user.id} />
    </div>
  )
}