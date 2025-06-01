'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { ArrowUp, ExternalLink, PencilLine, Trash, Users, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface UserServersProps {
  userId: string
}

export function UserServers({ userId }: UserServersProps) {
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [bumpingServer, setBumpingServer] = useState<string | null>(null)
  const [serverToDelete, setServerToDelete] = useState<string | null>(null)
  const [deletingServer, setDeletingServer] = useState(false)

  useEffect(() => {
    async function fetchUserServers() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('servers')
          .select('*')
          .eq('owner_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setServers(data || [])
      } catch (error) {
        console.error('Error fetching user servers:', error)
        toast.error('Failed to load your servers')
      } finally {
        setLoading(false)
      }
    }

    fetchUserServers()
  }, [userId])

  const handleBumpServer = async (serverId: string) => {
    setBumpingServer(serverId)
    try {
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()

      const { data: recentBumps } = await supabase
        .from('bump_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('server_id', serverId)
        .gte('bumped_at', twelveHoursAgo)

      if (recentBumps && recentBumps.length > 0) {
        toast.error('You can only bump a server once every 12 hours')
        return
      }

      await supabase
        .from('bump_logs')
        .insert({
          user_id: userId,
          server_id: serverId,
          bumped_at: new Date().toISOString()
        })

      await supabase
        .from('servers')
        .update({ last_bumped_at: new Date().toISOString() })
        .eq('id', serverId)

      toast.success('Server bumped successfully!')

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

  const handleDeleteServer = async () => {
    if (!serverToDelete) return

    setDeletingServer(true)
    try {
      await supabase
        .from('servers')
        .delete()
        .eq('id', serverToDelete)
        .eq('owner_id', userId)

      toast.success('Server deleted successfully!')
      setServers(servers.filter(server => server.id !== serverToDelete))
    } catch (error) {
      console.error('Error deleting server:', error)
      toast.error('Failed to delete server. Please try again.')
    } finally {
      setDeletingServer(false)
      setServerToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (servers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="mb-2 text-xl font-semibold">No servers added yet</h3>
        <p className="mb-6 text-muted-foreground">
          You haven&apos;t added any Discord servers to the directory.
        </p>
        <Button asChild>
          <Link href="/servers/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Server
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {servers.map((server) => (
          <Card key={server.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {server.name}
                    {!server.is_approved && (
                      <Badge variant="outline" className="ml-1">Pending</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {server.member_count.toLocaleString()} members
                  </CardDescription>
                </div>
                {server.icon_url && (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md">
                    <img
                      src={server.icon_url}
                      alt={server.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(server.tags || []).slice(0, 3).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2 mb-4">
                {server.description}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/servers/${server.id}`}>
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />
                    View
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!server.is_approved || bumpingServer === server.id}
                  onClick={() => handleBumpServer(server.id)}
                >
                  {bumpingServer === server.id ? (
                    <span>Bumping...</span>
                  ) : (
                    <>
                      <ArrowUp className="mr-2 h-3.5 w-3.5" />
                      Bump
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex w-full justify-between">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/servers/${server.id}/edit`}>
                    <PencilLine className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setServerToDelete(server.id)}
                >
                  <Trash className="mr-2 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!serverToDelete}
        onOpenChange={(open) => {
          if (!open) setServerToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your server from our directory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteServer}
              disabled={deletingServer}
              className="bg-destructive text-white"
            >
              {deletingServer ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
