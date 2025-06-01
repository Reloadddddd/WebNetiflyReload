import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ServerActions } from '@/components/server-actions'
import {
  Users, Globe, Calendar, ExternalLink, Flag,
  MessageSquare, Share, ChevronLeft
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

// === MOCK DATA ===
const demoServers = [
  {
    id: '1',
    name: 'GamersHub',
    description: 'The ultimate community for gamers of all types...',
    tags: ['Gaming', 'Esports', 'Streaming'],
    member_count: 15420,
    icon_url: 'https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg',
    banner_url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    invite_link: 'https://discord.gg/example',
    language: 'English',
    region: 'Global',
    created_at: '2023-08-15T00:00:00Z',
    last_bumped_at: new Date().toISOString(),
    is_verified: true
  },
  {
    id: '2',
    name: 'Anime Lounge',
    description: 'Discuss your favorite anime series...',
    tags: ['Anime', 'Manga', 'Japanese Culture'],
    member_count: 8750,
    icon_url: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg',
    banner_url: 'https://images.pexels.com/photos/7233352/pexels-photo-7233352.jpeg',
    invite_link: 'https://discord.gg/example',
    language: 'English',
    region: 'Global',
    created_at: '2023-09-20T00:00:00Z',
    last_bumped_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_verified: false
  }
]

// === STATIC PARAMS GENERATOR ===
export async function generateStaticParams() {
  return demoServers.map(server => ({
    id: server.id,
  }))
}

// === FETCH FUNCTION ===
async function getServer(id: string) {
  return demoServers.find(s => s.id === id) || null
}

// === PAGE COMPONENT ===
export default async function ServerPage({ params }: { params: { id: string } }) {
  const server = await getServer(params.id)

  if (!server) notFound()

  return (
    <>
      {/* Banner */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5">
        {server.banner_url && (
          <img
            src={server.banner_url}
            alt={`${server.name} banner`}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative">
        {/* Server Icon */}
        <div className="absolute -top-16 left-4 h-32 w-32 rounded-2xl border-4 border-background bg-muted md:-top-20 md:left-8 md:h-40 md:w-40 overflow-hidden">
          {server.icon_url ? (
            <img src={server.icon_url} alt={server.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/20">
              <span className="text-4xl font-bold text-primary">
                {server.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="pt-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/servers">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Servers
            </Link>
          </Button>
        </div>

        <div className="mt-16 md:mt-20 md:pl-44 lg:pl-48">
          {/* Header */}
          <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{server.name}</h1>
                {server.is_verified && (
                  <Badge variant="secondary" className="ml-2">Verified</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {server.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={server.invite_link} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Join Server
                </Link>
              </Button>
              <ServerActions serverId={server.id} />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Main Content */}
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="mb-3 text-xl font-semibold">Description</h2>
                <div className="rounded-lg border bg-card p-4 text-card-foreground">
                  <p className="whitespace-pre-wrap">{server.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-4 text-card-foreground">
                <h3 className="mb-3 font-semibold">Server Info</h3>
                <div className="space-y-3">
                  <InfoRow icon={<Users />} label="Members" value={server.member_count.toLocaleString()} />
                  <InfoRow icon={<Globe />} label="Language" value={server.language} />
                  <InfoRow icon={<Calendar />} label="Added" value={formatDistanceToNow(new Date(server.created_at), { addSuffix: true })} />
                </div>
              </div>

              <div className="rounded-lg border">
                <div className="p-4">
                  <Button className="w-full" asChild>
                    <Link href={server.invite_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Join Discord Server
                    </Link>
                  </Button>
                </div>
                <Separator />
                <div className="flex p-4">
                  <Button variant="outline" size="sm" className="flex-1 justify-center">
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Separator orientation="vertical" className="mx-2 h-9" />
                  <Button variant="outline" size="sm" className="flex-1 justify-center">
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// === SMALL COMPONENT ===
function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-muted-foreground">
        <span className="mr-2">{icon}</span>
        <span>{label}</span>
      </div>
      <span>{value}</span>
    </div>
  )
}
