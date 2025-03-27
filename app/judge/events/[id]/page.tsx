"use client"

import { useState, useEffect } from "react"
import JudgeLayout from "@/components/judge-layout"
import { ProjectList } from "@/components/judge/project-list"
import { RatingForm } from "@/components/judge/rating-form"
import { mockAPI } from "@/lib/mock-data"
import { Project, Event } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function JudgeEventPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const eventData = await mockAPI.getEventById(params.id)
        if (!eventData) {
          setError("Event not found")
          return
        }
        
        setEvent(eventData)
      } catch (err) {
        setError("Failed to load event")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
  }

  const handleRatingSubmitSuccess = () => {
    setSelectedProject(null)
  }

  if (loading) {
    return (
      <JudgeLayout>
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="ml-4">Loading event...</p>
        </div>
      </JudgeLayout>
    )
  }

  if (error || !event) {
    return (
      <JudgeLayout>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Event not found"}</AlertDescription>
        </Alert>
      </JudgeLayout>
    )
  }

  return (
    <JudgeLayout>
      <div className="space-y-6">
        {selectedProject ? (
          <>
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedProject(null)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </div>
            <RatingForm 
              project={selectedProject} 
              judgeId={user?.id || ''} 
              onSubmitSuccess={handleRatingSubmitSuccess} 
            />
          </>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
              <p className="text-muted-foreground mt-1">{event.description}</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Projects</h2>
              <p className="text-muted-foreground">
                Select a project to rate. Projects you've already rated will be marked.
              </p>
              
              <ProjectList 
                eventId={event.id} 
                judgeId={user?.id || ''} 
                onSelectProject={handleSelectProject} 
              />
            </div>
          </>
        )}
      </div>
    </JudgeLayout>
  )
}

