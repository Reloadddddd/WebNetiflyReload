import { AddServerForm } from '@/components/add-server-form'

export const metadata = {
  title: 'Add Your Discord Server | Discord Directory',
  description: 'Add your Discord server to our directory and reach more people.',
}

export default function AddServerPage() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Add Your Server</h1>
        <p className="text-muted-foreground">
          Share your Discord server with our community and attract new members.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <AddServerForm />
        </div>
        
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-xl">Submission Guidelines</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>Your server must comply with Discord&apos;s Terms of Service and Community Guidelines.</li>
            <li>Servers with illegal, NSFW, or hateful content will be rejected.</li>
            <li>Provide an accurate description and appropriate tags for your server.</li>
            <li>Ensure your invite link is valid and doesn&apos;t expire.</li>
            <li>You can add up to 5 servers per account.</li>
            <li>All submissions are reviewed by our moderators before being listed.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}