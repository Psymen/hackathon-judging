"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Project, Rating } from "@/lib/mock-data"
import { mockAPI } from "@/lib/mock-data"
import { CheckCircle, XCircle } from "lucide-react"

interface ProjectListProps {
  eventId: string
  judgeId: string
  onSelectProject: (project: Project) => void
}

export function ProjectList({ eventId, judgeId, onSelectProject }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [ratedProjects, setRatedProjects] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch projects for this event
        const projectsData = await mockAPI.getProjectsByEventId(eventId)
        setProjects(projectsData)

        // Fetch ratings by this judge
        const ratingsData = await mockAPI.getRatingsByJudgeId(judgeId)
        
        // Create a set of project IDs that have been rated
        const ratedProjectIds = new Set(ratingsData.map((rating: Rating) => rating.projectId))
        setRatedProjects(ratedProjectIds)
      } catch (err) {
        setError("Failed to load projects")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventId, judgeId])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No projects available for this event.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelectProject(project)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-muted-foreground">Team: {project.teamName}</p>
                <p className="mt-2 text-sm line-clamp-2">{project.description}</p>
              </div>
              <div className="flex items-center">
                {ratedProjects.has(project.id) ? (
                  <div className="flex items-center text-green-600 dark:text-green-500">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Rated</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600 dark:text-amber-500">
                    <XCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Not Rated</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}