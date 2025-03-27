"use client"

import { useState } from "react"
import JudgeLayout from "@/components/judge-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function JudgeEventPage({ params }: { params: { id: string } }) {
  const [currentProject, setCurrentProject] = useState(0)
  const [ratings, setRatings] = useState<Record<string, Record<string, number | string>>>({
    "1": {
      innovation: 0,
      technical: 0,
      design: 0,
      practicality: 0,
      comments: "",
    },
    "2": {
      innovation: 0,
      technical: 0,
      design: 0,
      practicality: 0,
      comments: "",
    },
    "3": {
      innovation: 0,
      technical: 0,
      design: 0,
      practicality: 0,
      comments: "",
    },
  })

  // Mock data for projects
  const projects = [
    {
      id: 1,
      name: "EcoTrack",
      team: "Green Innovators",
      description: "A mobile app that helps users track and reduce their carbon footprint through daily activities.",
    },
    {
      id: 2,
      name: "MediConnect",
      team: "Health Tech Solutions",
      description: "A platform connecting patients with healthcare providers for remote consultations and follow-ups.",
    },
    {
      id: 3,
      name: "SmartBudget",
      team: "FinTech Wizards",
      description: "An AI-powered personal finance tool that helps users manage expenses and save money.",
    },
  ]

  // Mock data for judging criteria
  const criteria = [
    { id: "innovation", name: "Innovation", description: "How innovative is the solution?", max: 10 },
    {
      id: "technical",
      name: "Technical Complexity",
      description: "How technically complex is the implementation?",
      max: 10,
    },
    { id: "design", name: "Design", description: "How well designed is the user interface and experience?", max: 10 },
    { id: "practicality", name: "Practicality", description: "How practical and useful is the solution?", max: 10 },
  ]

  const handleRatingChange = (projectId: number, criterionId: string, value: number) => {
    setRatings({
      ...ratings,
      [projectId]: {
        ...ratings[projectId],
        [criterionId]: value,
      },
    })
  }

  const handleCommentsChange = (projectId: number, value: string) => {
    setRatings({
      ...ratings,
      [projectId]: {
        ...ratings[projectId],
        comments: value,
      },
    })
  }

  const handlePrevious = () => {
    if (currentProject > 0) {
      setCurrentProject(currentProject - 1)
    }
  }

  const handleNext = () => {
    if (currentProject < projects.length - 1) {
      setCurrentProject(currentProject + 1)
    }
  }

  const handleSubmit = () => {
    // In a real app, this would submit the ratings to the server
    alert("Ratings submitted successfully!")
  }

  const project = projects[currentProject]
  const projectRatings = ratings[project.id]

  return (
    <JudgeLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Judge Projects</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentProject === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm">
              {currentProject + 1} of {projects.length}
            </span>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={currentProject === projects.length - 1}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>Team: {project.team}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{project.description}</p>

            <div className="space-y-6 mt-6">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`rating-${criterion.id}`}>{criterion.name}</Label>
                    <span className="text-sm font-medium">
                      {projectRatings[criterion.id]} / {criterion.max}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{criterion.description}</p>
                  <Slider
                    id={`rating-${criterion.id}`}
                    min={0}
                    max={criterion.max}
                    step={1}
                    value={[Number(projectRatings[criterion.id])]}
                    onValueChange={(value) => handleRatingChange(project.id, criterion.id, value[0])}
                  />
                </div>
              ))}

              <div className="space-y-2 mt-6">
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Add any additional feedback or comments..."
                  value={projectRatings.comments as string}
                  onChange={(e) => handleCommentsChange(project.id, e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setCurrentProject(0)}>
            Reset
          </Button>
          <Button onClick={handleSubmit}>Submit Ratings</Button>
        </div>
      </div>
    </JudgeLayout>
  )
}

