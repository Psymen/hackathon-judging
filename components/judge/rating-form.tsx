"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Project, JudgingCriteria, Rating } from "@/lib/mock-data"
import { mockAPI } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface RatingFormProps {
  project: Project
  judgeId: string
  onSubmitSuccess: () => void
}

export function RatingForm({ project, judgeId, onSubmitSuccess }: RatingFormProps) {
  const { toast } = useToast()
  const [criteria, setCriteria] = useState<JudgingCriteria[]>([])
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingRatings, setExistingRatings] = useState<Record<string, Rating>>({})

  // Fetch criteria and existing ratings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch criteria for this event
        const criteriaData = await mockAPI.getCriteriaByEventId(project.eventId)
        setCriteria(criteriaData)

        // Initialize ratings
        const initialRatings: Record<string, number> = {}
        criteriaData.forEach((criterion) => {
          initialRatings[criterion.id] = 0
        })
        setRatings(initialRatings)

        // Fetch existing ratings by this judge for this project
        const judgeRatings = await mockAPI.getRatingsByJudgeId(judgeId)
        const projectRatings = await mockAPI.getRatingsByProjectId(project.id)
        
        // Find ratings that match both the judge and the project
        const matchingRatings = judgeRatings.filter(
          (rating) => projectRatings.some((pr) => pr.id === rating.id)
        )

        if (matchingRatings.length > 0) {
          // If we have existing ratings, populate the form
          const ratingMap: Record<string, Rating> = {}
          const ratingValues: Record<string, number> = {}
          
          matchingRatings.forEach((rating) => {
            ratingMap[rating.criteriaId] = rating
            ratingValues[rating.criteriaId] = rating.score
          })
          
          setExistingRatings(ratingMap)
          setRatings(ratingValues)
          setComment(matchingRatings[0].comment)
        }
      } catch (err) {
        setError("Failed to load criteria and ratings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [project.id, project.eventId, judgeId])

  const handleRatingChange = (criterionId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [criterionId]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setError(null)
      setSubmitting(true)

      // Validate that all criteria have been rated
      const hasUnratedCriteria = Object.values(ratings).some((rating) => rating === 0)
      if (hasUnratedCriteria) {
        setError("Please rate all criteria before submitting")
        return
      }

      // Submit ratings for each criterion
      for (const criterion of criteria) {
        const ratingData = {
          score: ratings[criterion.id],
          comment,
          judgeId,
          projectId: project.id,
          criteriaId: criterion.id,
          eventId: project.eventId,
        }

        if (existingRatings[criterion.id]) {
          // Update existing rating
          await mockAPI.updateRating(existingRatings[criterion.id].id, {
            score: ratings[criterion.id],
            comment,
          })
        } else {
          // Create new rating
          await mockAPI.createRating(ratingData)
        }
      }

      toast({
        title: "Ratings submitted",
        description: "Your ratings have been saved successfully.",
      })

      onSubmitSuccess()
    } catch (err) {
      setError("Failed to submit ratings. Please try again.")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
          <p className="text-center mt-4">Loading criteria...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>Team: {project.teamName}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-6">{project.description}</p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`rating-${criterion.id}`}>{criterion.name}</Label>
                <span className="text-sm font-medium">
                  {ratings[criterion.id]} / {criterion.maxScore}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{criterion.description}</p>
              <Slider
                id={`rating-${criterion.id}`}
                min={0}
                max={criterion.maxScore}
                step={1}
                value={[ratings[criterion.id]]}
                onValueChange={(value) => handleRatingChange(criterion.id, value[0])}
              />
            </div>
          ))}

          <div className="space-y-2 mt-6">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Add any additional feedback or comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onSubmitSuccess}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Ratings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}