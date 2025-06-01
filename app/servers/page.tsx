import { Suspense } from 'react'
import { ServerList } from '@/components/server-list'
import { ServerFilters } from '@/components/server-filters'
import { ServerSearch } from '@/components/server-search'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Browse Discord Servers | Discord Directory',
  description: 'Discover and join Discord servers. Find communities for gaming, anime, music, art, technology and more.',
}

export default function ServersPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Browse Discord Servers
        </h1>
        <p className="text-lg text-muted-foreground">
          Find and join communities that match your interests
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="hidden md:block">
          <ServerFilters />
        </div>
        <div className="space-y-6">
          <ServerSearch />
          <Suspense fallback={<ServerListSkeleton />}>
            <ServerList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ServerListSkeleton() {
  return (
    <div className="grid gap-6">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-lg border p-4">
          <Skeleton className="h-16 w-16 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}