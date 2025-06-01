"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'

export function ServerSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'top')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) {
      params.set('q', searchTerm)
    } else {
      params.delete('q')
    }
    
    router.push(`/servers?${params.toString()}`)
  }
  
  const handleSortChange = (value: string) => {
    setSort(value)
    
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    
    router.push(`/servers?${params.toString()}`)
  }
  
  const clearSearch = () => {
    setSearchTerm('')
    
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    
    router.push(`/servers?${params.toString()}`)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search servers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </form>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top Servers</SelectItem>
            <SelectItem value="new">Newest</SelectItem>
            <SelectItem value="bumped">Recently Bumped</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {searchParams.has('category') && (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">
            Filtered by:
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.delete('category')
              router.push(`/servers?${params.toString()}`)
            }}
          >
            {searchParams.get('category')}
            <X className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}