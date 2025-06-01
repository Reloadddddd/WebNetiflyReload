"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Info, Loader2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

const serverSchema = z.object({
  name: z.string().min(3, 'Server name must be at least 3 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  invite_link: z.string()
    .url('Please enter a valid Discord invite URL')
    .refine((url) => url.includes('discord.gg'), {
      message: 'Must be a Discord invite link'
    }),
  language: z.string().min(1, 'Please select a language'),
  region: z.string().min(1, 'Please select a region'),
  icon_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  banner_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, 'Select at least 1 tag').max(5, 'You can select up to 5 tags'),
})

type ServerFormValues = z.infer<typeof serverSchema>

const languages = [
  'English', 'Spanish', 'French', 'German', 'Japanese', 
  'Chinese', 'Korean', 'Portuguese', 'Russian', 'Arabic'
]

const regions = [
  'Global', 'North America', 'South America', 'Europe', 
  'Asia', 'Oceania', 'Africa', 'Middle East'
]

const availableTags = [
  'Gaming', 'Anime', 'Music', 'Art', 'Education', 'Community',
  'Technology', 'Programming', 'Food', 'Languages', 'Dating',
  'Memes', 'Roleplay', 'Sports', 'Science', 'Entertainment',
  'Cryptocurrency', 'Finance', 'Politics', 'Books', 'Writing',
  'Fashion', 'Health', 'Fitness', 'Travel', 'Photography',
  'Movies', 'Television', 'Pets', 'Nature', 'History',
]

export function AddServerForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: '',
      description: '',
      invite_link: '',
      language: '',
      region: '',
      icon_url: '',
      banner_url: '',
      tags: [],
    },
  })
  
  const onSubmit = async (values: ServerFormValues) => {
    if (!user) {
      toast.error('You must be logged in to add a server')
      return
    }
    
    setIsSubmitting(true)
    try {
      // Validate Discord invite link
      // In a real implementation, you would use the Discord API to validate the invite and get member count
      
      // Check if user has already added 5 servers
      const { data: userServers, error: serverCheckError } = await supabase
        .from('servers')
        .select('id')
        .eq('owner_id', user.id)
      
      if (serverCheckError) throw serverCheckError
      
      if (userServers && userServers.length >= 5) {
        toast.error('You can only add up to 5 servers')
        return
      }
      
      // Add server to database
      const { data, error } = await supabase
        .from('servers')
        .insert({
          owner_id: user.id,
          name: values.name,
          description: values.description,
          invite_link: values.invite_link,
          language: values.language,
          region: values.region,
          icon_url: values.icon_url || null,
          banner_url: values.banner_url || null,
          tags: values.tags,
          member_count: 0, // This would be fetched from Discord API in a real implementation
          is_verified: false,
          is_approved: false, // Requires admin approval
        })
        .select()
      
      if (error) throw error
      
      toast.success('Server submitted successfully! It will be reviewed by our team.')
      router.push('/servers/mine')
    } catch (error) {
      console.error('Error adding server:', error)
      toast.error('Failed to add server. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const addTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    } else {
      toast.error('You can select up to 5 tags')
    }
    
    form.setValue('tags', selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag].slice(0, 5)
    )
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your server name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languages.map(language => (
                      <SelectItem key={language} value={language}>{language}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your server..."
                  className="min-h-32 resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell potential members what your server is about. Be descriptive!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="invite_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discord Invite Link</FormLabel>
              <FormControl>
                <Input placeholder="https://discord.gg/..." {...field} />
              </FormControl>
              <FormDescription>
                Use a permanent invite link that doesn&apos;t expire
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="icon_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Icon URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormDescription>
                  Direct link to your server icon image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="banner_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormDescription>
                  Direct link to a banner image (recommended: 960x540)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Select up to 5)</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                    {selectedTags.length === 0 && (
                      <div className="text-sm text-muted-foreground py-1">
                        No tags selected
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    {availableTags
                      .filter(tag => !selectedTags.includes(tag))
                      .map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="rounded-md bg-primary/10 p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Your server submission will be reviewed by our moderators before being listed in the directory.</p>
            <p>This typically takes 1-2 business days. You&apos;ll receive a notification when your server is approved.</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting || !user}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Submitting...' : 'Add Server'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
