"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export default function NewEventPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/events")
    }, 1000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
          <p className="text-muted-foreground">Set up a new hackathon event and define judging criteria.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Basic information about your hackathon event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input id="name" placeholder="Summer Hackathon 2025" required />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your hackathon event..." rows={4} required />
              </div>
            </CardContent>
          </Card>

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
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCriteria(criterion.id)}>
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

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

