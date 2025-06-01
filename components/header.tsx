'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { Search, Menu, Plus, User, LogOut, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function Header() {
  const { user, signOut } = useAuth()

  const handleDiscordLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="currentColor">
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
            </svg>
            <span className="hidden font-bold sm:inline-block">Discord Directory</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <Link href="/servers" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">All Servers</div>
                      <div className="text-sm text-muted-foreground">Browse all Discord servers</div>
                    </Link>
                    <Link href="/servers?sort=top" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">Top Servers</div>
                      <div className="text-sm text-muted-foreground">Most popular Discord communities</div>
                    </Link>
                    <Link href="/servers?sort=new" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">New Servers</div>
                      <div className="text-sm text-muted-foreground">Recently added Discord servers</div>
                    </Link>
                    <Link href="/tags" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">Categories</div>
                      <div className="text-sm text-muted-foreground">Browse servers by category</div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <Link href="/tags/gaming" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">Gaming</div>
                    </Link>
                    <Link href="/tags/anime" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">Anime</div>
                    </Link>
                    <Link href="/tags/music" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">Music</div>
                    </Link>
                    <Link href="/tags/community" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">Community</div>
                    </Link>
                    <Link href="/tags/technology" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">Technology</div>
                    </Link>
                    <Link href="/tags/education" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">Education</div>
                    </Link>
                    <Link href="/tags" className="block p-3 space-y-1 rounded-md hover:bg-accent">
                      <div className="font-medium">View All Categories →</div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/how-it-works" legacyBehavior passHref>
                  <NavigationMenuLink className="font-medium">
                    How It Works
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild className="hidden md:flex">
            <Link href="/search">
              <Search className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          <ModeToggle />

          {user ? (
            <>
              <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
                <Link href="/servers/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Server
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url || ''}
                        alt={user.user_metadata?.full_name || 'User'}
                      />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.substring(0, 2).toUpperCase() || 'US'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/servers/mine">
                      <Settings className="mr-2 h-4 w-4" />
                      My Servers
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={handleDiscordLogin} className="hidden md:inline-flex">
              Login with Discord
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
