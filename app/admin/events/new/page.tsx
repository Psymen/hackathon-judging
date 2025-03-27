"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { EventForm } from "@/components/admin/events/event-form"
import { mockAPI, Event } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

export default function NewEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  
  const [criteria, setCriteria] = useState([
    { id: 1, name: "Innovation", description: "How innovative is the solution?", weight: 30 },
    { id: 2, name: "Technical Complexity", description: "How technically complex is the implementation?", weight: 25 },
    { id: 3, name: "Design", description: "How well designed is the user interface and experience?", weight: 20 },
    { id: 4, name: "Practicality", description: "How practical and useful is the solution?", weight: 25 },
  ])

  const handleAddCriteria = () => {
    const newId = criteria.length > 0 ? Math.max(...criteria.map((c) => c.id)) + 1 : 1
    setCriteria([...criteria, { id: newId, name: "", description: "", weight: 0 }])
  }

  const handleRemoveCriteria = (id: number) => {
    setCriteria(criteria.filter((c) => c.id !== id))
  }

  const handleCriteriaChange = (id: number, field: string, value: string | number) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleSubmit = async (eventData: Partial<Event>) => {
    if (!user) return
    
    setIsSubmitting(true)
    try {
      // Create the event
      const newEvent = await mockAPI.createEvent({
        ...eventData as Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
        createdBy: user.id,
      })
      
      // Create judging criteria for the event
      for (const criterion of criteria) {
        if (criterion.name.trim() && criterion.description.trim()) {
          await mockAPI.createCriteria({
            name: criterion.name,
            description: criterion.description,
            maxScore: 10,
            weight: criterion.weight / 100, // Convert percentage to decimal
            eventId: newEvent.id,
          })
        }
      }
      
      toast({
        title: "Event created",
        description: "The event has been created successfully.",
      })
      
      // Redirect to events list
      router.push("/admin/events")
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
          <p className="text-muted-foreground">Set up a new hackathon event and define judging criteria.</p>
        </div>

        <div className="space-y-8">
          {/* Event Form */}
          <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          
          {/* Judging Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Judging Criteria</CardTitle>
              <CardDescription>Define the criteria that judges will use to evaluate projects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Criterion {criterion.id}</h4>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveCriteria(criterion.id)}
                      disabled={criteria.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`criterion-name-${criterion.id}`}>Name</Label>
                    <Input
                      id={`criterion-name-${criterion.id}`}
                      value={criterion.name}
                      onChange={(e) => handleCriteriaChange(criterion.id, "name", e.target.value)}
                      placeholder="Innovation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`criterion-desc-${criterion.id}`}>Description</Label>
                    <Textarea
                      id={`criterion-desc-${criterion.id}`}
                      value={criterion.description}
                      onChange={(e) => handleCriteriaChange(criterion.id, "description", e.target.value)}
                      placeholder="How innovative is the solution?"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`criterion-weight-${criterion.id}`}>Weight (%) - {criterion.weight}</Label>
                    <Input
                      id={`criterion-weight-${criterion.id}`}
                      type="range"
                      min="0"
                      max="100"
                      value={criterion.weight}
                      onChange={(e) => handleCriteriaChange(criterion.id, "weight", Number.parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={handleAddCriteria} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Criterion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

