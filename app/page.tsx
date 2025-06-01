import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FeaturedServers } from '@/components/featured-servers'
import { CategoryTags } from '@/components/category-tags'
import { Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 py-20">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Find Your Perfect Discord Community
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground md:text-xl">
            Discover thousands of Discord servers for gaming, music, anime, education, and more. Join communities that match your interests.
          </p>
          
          {/* Search Bar */}
          <div className="mx-auto mb-8 flex max-w-md items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Search servers by name or category..." 
              className="h-12"
            />
            <Button type="submit" size="icon" className="h-12 w-12">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/servers">Browse Servers</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/servers/add">Add Your Server</Link>
            </Button>
          </div>
        </div>
        
        {/* Abstract Background Effect */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px]" />
        </div>
      </section>

      {/* Featured Servers */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
            Popular Discord Servers
          </h2>
          <FeaturedServers />
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/servers">View All Servers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
            Browse by Category
          </h2>
          <CategoryTags />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Find</h3>
              <p className="text-muted-foreground">
                Search and discover Discord servers that match your interests with advanced filters.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Join</h3>
              <p className="text-muted-foreground">
                Connect with communities that share your passion with just one click.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Share</h3>
              <p className="text-muted-foreground">
                Add your own server to our directory and watch your community grow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}