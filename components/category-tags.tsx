"use client"

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { 
  Gamepad2, Music, PaintBucket, Tv, Book, Globe, Users, Pizza, 
  Code, Cpu, Heart, Image, Speech, Award, Coffee, Dumbbell
} from 'lucide-react'

const categories = [
  { name: 'Gaming', icon: <Gamepad2 className="h-3 w-3 mr-1" /> },
  { name: 'Anime', icon: <Tv className="h-3 w-3 mr-1" /> },
  { name: 'Music', icon: <Music className="h-3 w-3 mr-1" /> },
  { name: 'Art', icon: <PaintBucket className="h-3 w-3 mr-1" /> },
  { name: 'Education', icon: <Book className="h-3 w-3 mr-1" /> },
  { name: 'Community', icon: <Users className="h-3 w-3 mr-1" /> },
  { name: 'Technology', icon: <Cpu className="h-3 w-3 mr-1" /> },
  { name: 'Programming', icon: <Code className="h-3 w-3 mr-1" /> },
  { name: 'Food', icon: <Pizza className="h-3 w-3 mr-1" /> },
  { name: 'Languages', icon: <Globe className="h-3 w-3 mr-1" /> },
  { name: 'Dating', icon: <Heart className="h-3 w-3 mr-1" /> },
  { name: 'Memes', icon: <Image className="h-3 w-3 mr-1" /> },
  { name: 'Roleplay', icon: <Speech className="h-3 w-3 mr-1" /> },
  { name: 'Sports', icon: <Dumbbell className="h-3 w-3 mr-1" /> },
  { name: 'Science', icon: <Award className="h-3 w-3 mr-1" /> },
  { name: 'Entertainment', icon: <Coffee className="h-3 w-3 mr-1" /> },
]

export function CategoryTags() {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {categories.map((category) => (
        <Link key={category.name} href={`/tags/${category.name.toLowerCase()}`}>
          <Badge variant="outline" className="px-3 py-1 text-sm transition-all hover:bg-secondary">
            {category.icon}
            {category.name}
          </Badge>
        </Link>
      ))}
      <Link href="/tags">
        <Badge variant="outline" className="px-3 py-1 text-sm transition-all hover:bg-secondary">
          View All Categories
        </Badge>
      </Link>
    </div>
  )
}