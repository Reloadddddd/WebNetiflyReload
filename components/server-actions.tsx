"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { ArrowUp, MoreHorizontal, Edit, Trash, Flag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface ServerActionsProps {
  serverId: string
}

export function ServerActions({ serverId }: ServerActionsProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [bumpingServer, setBumpingServer] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingServer, setDeletingServer] = useState(false)
  
  // For demo purposes, we'll just check if the user is logged in
  // In a real app, you'd check if the user owns this server
  const canManageServer = user ? true : false
  
  const handleBumpServer = async () => {
    if (!user) {
      toast.error('You need to be logged in to bump a server')
      return
    }
    
    setBumpingServer(true)
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
      router.refresh()
    } catch (error) {
      console.error('Error bumping server:', error)
      toast.error('Failed to bump server. Please try again.')
    } finally {
      setBumpingServer(false)
    }
  }
  
  const handleDeleteServer = async () => {
    if (!user) return
    
    setDeletingServer(true)
    try {
      await supabase
        .from('servers')
        .delete()
        .eq('id', serverId)
        .eq('owner_id', user.id)
      
      toast.success('Server deleted successfully!')
      router.push('/servers')
    } catch (error) {
      console.error('Error deleting server:', error)
      toast.error('Failed to delete server. Please try again.')
    } finally {
      setDeletingServer(false)
      setShowDeleteDialog(false)
    }
  }
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBumpServer}
        disabled={bumpingServer || !user}
      >
        {bumpingServer ? (
          <span>Bumping...</span>
        ) : (
          <>
            <ArrowUp className="mr-2 h-4 w-4" />
            Bump
          </>
        )}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <button className="flex w-full cursor-pointer items-center">
              <Flag className="mr-2 h-4 w-4" />
              Report Server
            </button>
          </DropdownMenuItem>
          
          {canManageServer && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button 
                  className="flex w-full cursor-pointer items-center"
                  onClick={() => router.push(`/servers/${serverId}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Server
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button 
                  className="flex w-full cursor-pointer items-center text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Server
                </button>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your server from our database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteServer}
              disabled={deletingServer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingServer ? 'Deleting...' : 'Delete Server'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}