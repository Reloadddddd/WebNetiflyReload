"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'

const categories = [
  'Gaming',
  'Anime',
  'Music',
  'Art',
  'Education',
  'Community',
  'Technology',
  'Programming',
  'Food',
  'Languages',
  'Dating',
  'Memes',
  'Roleplay',
  'Sports',
  'Science',
  'Entertainment',
]

const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Chinese',
  'Korean',
  'Portuguese',
  'Russian',
  'Arabic',
]

export function ServerFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentCategory = searchParams.get('category')
  const currentLanguage = searchParams.get('language')
  
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    router.push(`/servers?${params.toString()}`)
  }
  
  const handleLanguageChange = (language: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('language', language)
    router.push(`/servers?${params.toString()}`)
  }
  
  const clearFilters = () => {
    const params = new URLSearchParams()
    const sort = searchParams.get('sort')
    const q = searchParams.get('q')
    
    if (sort) params.set('sort', sort)
    if (q) params.set('q', q)
    
    router.push(`/servers?${params.toString()}`)
  }
  
  const hasFilters = currentCategory || currentLanguage
  
  return (
    <div className="space-y-4">
      {hasFilters && (
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Active Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-3 w-3" />
              Clear All
            </Button>
          </div>
          <Separator className="my-2" />
          <div className="flex flex-wrap gap-2">
            {currentCategory && (
              <Badge variant="secondary">
                Category: {currentCategory}
              </Badge>
            )}
            {currentLanguage && (
              <Badge variant="secondary">
                Language: {currentLanguage}
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <div className="rounded-lg border">
        <Accordion type="multiple" defaultValue={["categories", "languages"]}>
          <AccordionItem value="categories" className="border-b">
            <AccordionTrigger className="px-4">Categories</AccordionTrigger>
            <AccordionContent className="px-4 pt-1 pb-3">
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox 
                      id={`category-${category.toLowerCase()}`}
                      checked={currentCategory === category}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label 
                      htmlFor={`category-${category.toLowerCase()}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="languages">
            <AccordionTrigger className="px-4">Languages</AccordionTrigger>
            <AccordionContent className="px-4 pt-1 pb-3">
              <RadioGroup
                value={currentLanguage || ""}
                onValueChange={handleLanguageChange}
              >
                {languages.map((language) => (
                  <div key={language} className="flex items-center gap-2">
                    <RadioGroupItem 
                      id={`language-${language.toLowerCase()}`}
                      value={language} 
                    />
                    <Label 
                      htmlFor={`language-${language.toLowerCase()}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {language}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}