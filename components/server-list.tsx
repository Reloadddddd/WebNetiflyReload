"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, ArrowUpRight, ArrowUp, Calendar } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

export function ServerList() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [bumpingServer, setBumpingServer] = useState<string | null>(null)
  
  const sort = searchParams.get('sort') || 'top'
  const category = searchParams.get('category')
  const language = searchParams.get('language')
  const searchQuery = searchParams.get('q')
  
  useEffect(() => {
    async function fetchServers() {
      setLoading(true)
      try {
        let query = supabase
          .from('servers')
          .select('*')
          .eq('is_approved', true)
        
        if (category) {
          query = query.contains('tags', [category])
        }
        
        if (language) {
          query = query.eq('language', language)
        }
        
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`)
        }
        
        if (sort === 'top') {
          query = query.order('member_count', { ascending: false })
        } else if (sort === 'new') {
          query = query.order('created_at', { ascending: false })
        } else if (sort === 'bumped') {
          query = query.order('last_bumped_at', { ascending: false })
        }
        
        const { data, error } = await query.limit(20)
        
        if (error) throw error
        setServers(data || [])
      } catch (error) {
        console.error('Error fetching servers:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchServers()
  }, [sort, category, language, searchQuery])

  const handleBumpServer = async (serverId: string) => {
    if (!user) {
      toast.error('You need to be logged in to bump a server')
      return
    }
    
    setBumpingServer(serverId)
    try {
      // Check if user has bumped this server in the last 12 hours
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      
      const { data: recentBumps } = await supabase
        .from('bump_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('server_id', serverId)
        .gte('bumped_at', twelveHoursAgo)
      
      if (recentBumps && recentBumps.length > 0) {
        toast.error('You can only bump a server once every 12 hours')
        return
      }
      
      // Log the bump
      await supabase
        .from('bump_logs')
        .insert({
          user_id: user.id,
          server_id: serverId,
          bumped_at: new Date().toISOString()
        })
      
      // Update the server's last_bumped_at time
      await supabase
        .from('servers')
        .update({ last_bumped_at: new Date().toISOString() })
        .eq('id', serverId)
      
      toast.success('Server bumped successfully!')
      
      // Update the local state to reflect the change
      setServers(servers.map(server => 
        server.id === serverId 
          ? { ...server, last_bumped_at: new Date().toISOString() }
          : server
      ))
    } catch (error) {
      console.error('Error bumping server:', error)
      toast.error('Failed to bump server. Please try again.')
    } finally {
      setBumpingServer(null)
    }
  }

  // Use sample data for development if no real data from Supabase
  const demoServers = [
    {
      id: '1',
      name: 'GamersHub',
      description: 'The ultimate community for gamers of all types. Join discussions, find teammates, and share your gaming moments.',
      tags: ['Gaming', 'Esports', 'Streaming'],
      member_count: 15420,
      icon_url: 'https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      invite_link: 'https://discord.gg/example',
      language: 'English',
      region: 'Global',
      last_bumped_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Anime Lounge',
      description: 'Discuss your favorite anime series, share fan art, and join watch parties with fellow anime enthusiasts.',
      tags: ['Anime', 'Manga', 'Japanese Culture'],
      member_count: 8750,
      icon_url: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      invite_link: 'https://discord.gg/example',
      language: 'English',
      region: 'Global',
      last_bumped_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Developers United',
      description: 'A supportive community for developers to share knowledge, get help with coding problems, and collaborate on projects.',
      tags: ['Programming', 'Web Development', 'Open Source'],
      member_count: 12300,
      icon_url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      invite_link: 'https://discord.gg/example',
      language: 'English',
      region: 'Global',
      last_bumped_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  const displayServers = servers.length > 0 ? servers : demoServers;
  
  if (loading) {
    return <ServerListSkeleton />
  }
  
  if (displayServers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-xl font-semibold">No servers found</h3>
        <p className="mb-6 text-muted-foreground">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <Button asChild>
          <Link href="/servers">Clear Filters</Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="grid gap-6">
      {displayServers.map((server) => (
        <Card key={server.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-40 w-full md:h-auto md:w-40 shrink-0">
              <div className="absolute inset-0 bg-muted">
                {server.icon_url ? (
                  <img
                    src={server.icon_url}
                    alt={server.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10">
                    <span className="text-2xl font-bold text-primary">
                      {server.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold text-xl truncate">
                  <Link href={`/servers/${server.id}`} className="hover:underline">
                    {server.name}
                  </Link>
                </h3>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {server.member_count.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="flex-1 text-muted-foreground line-clamp-2 mb-4">
                {server.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {(server.tags || []).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                <Badge variant="outline">{server.language}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  Last bumped: {new Date(server.last_bumped_at || server.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBumpServer(server.id)}
                    disabled={bumpingServer === server.id || !user}
                  >
                    {bumpingServer === server.id ? (
                      <span>Bumping...</span>
                    ) : (
                      <>
                        <ArrowUp className="mr-1 h-3.5 w-3.5" />
                        Bump
                      </>
                    )}
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/servers/${server.id}`}>
                      View
                      <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function ServerListSkeleton() {
  return (
    <div className="grid gap-6">
      {Array(5).fill(0).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="h-40 w-full md:h-auto md:w-40 shrink-0">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-4" />
              <div className="mb-4 flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
