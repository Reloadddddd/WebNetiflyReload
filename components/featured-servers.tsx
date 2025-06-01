"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, ArrowUpRight, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function FeaturedServers() {
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchServers() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('servers')
          .select('*')
          .eq('is_approved', true)
          .order('member_count', { ascending: false })
          .limit(6)
        
        if (error) throw error
        setServers(data || [])
      } catch (error) {
        console.error('Error fetching servers:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchServers()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-0">
              <Skeleton className="aspect-[5/2] w-full" />
            </CardHeader>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array(3).fill(0).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-16" />
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
  
  // Sample servers for development
  const demoServers = [
    {
      id: '1',
      name: 'GamersHub',
      description: 'The ultimate community for gamers of all types. Join discussions, find teammates, and share your gaming moments.',
      tags: ['Gaming', 'Esports', 'Streaming'],
      member_count: 15420,
      icon_url: 'https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      invite_link: 'https://discord.gg/example'
    },
    {
      id: '2',
      name: 'Anime Lounge',
      description: 'Discuss your favorite anime series, share fan art, and join watch parties with fellow anime enthusiasts.',
      tags: ['Anime', 'Manga', 'Japanese Culture'],
      member_count: 8750,
      icon_url: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      invite_link: 'https://discord.gg/example'
    },
    {
      id: '3',
      name: 'Developers United',
      description: 'A supportive community for developers to share knowledge, get help with coding problems, and collaborate on projects.',
      tags: ['Programming', 'Web Development', 'Open Source'],
      member_count: 12300,
      icon_url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      invite_link: 'https://discord.gg/example'
    },
    {
      id: '4',
      name: 'Music Enthusiasts',
      description: 'Share your favorite tracks, discover new artists, and discuss all things music with like-minded fans.',
      tags: ['Music', 'Production', 'Artists'],
      member_count: 6800,
      icon_url: 'https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      invite_link: 'https://discord.gg/example'
    },
    {
      id: '5',
      name: 'Creative Corner',
      description: 'A space for artists, designers, and creators to share their work, get feedback, and find inspiration.',
      tags: ['Art', 'Design', 'Creative'],
      member_count: 9200,
      icon_url: 'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      invite_link: 'https://discord.gg/example'
    },
    {
      id: '6',
      name: 'Study Buddies',
      description: 'Find study partners, get homework help, and join focused study sessions with students from around the world.',
      tags: ['Education', 'Study', 'Academic'],
      member_count: 5600,
      icon_url: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      invite_link: 'https://discord.gg/example'
    }
  ];

  // Use sample data for development
  const displayServers = servers.length > 0 ? servers : demoServers;
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayServers.map((server) => (
        <Card key={server.id} className="overflow-hidden transition-all hover:shadow-md">
          {server.banner_url ? (
            <CardHeader className="p-0">
              <div className="relative aspect-[5/2] w-full overflow-hidden">
                <img
                  src={server.banner_url || server.icon_url}
                  alt={server.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </CardHeader>
          ) : (
            <CardHeader className="p-0">
              <div className="aspect-[5/2] w-full bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
                {server.icon_url ? (
                  <img
                    src={server.icon_url}
                    alt={server.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {server.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
          )}
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xl truncate">{server.name}</h3>
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {server.member_count.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {server.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {(server.tags || []).slice(0, 3).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link href={`/servers/${server.id}`}>
                View Server
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}