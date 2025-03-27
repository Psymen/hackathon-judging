"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Download, Edit, Users } from "lucide-react"
import Link from "next/link"
import { mockAPI } from "@/lib/mock-data"
import { formatDateRange } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [judges, setJudges] = useState<any[]>([])
  const [criteria, setCriteria] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalJudges: 0,
    completedJudges: 0,
    judgeProgress: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Fetch event details
        const eventData = await mockAPI.getEventById(params.id)
        if (!eventData) {
          throw new Error("Event not found")
        }
        setEvent(eventData)
        
        // Fetch projects for this event
        const projectsData = await mockAPI.getProjectsByEventId(params.id)
        setProjects(projectsData)
        
        // Fetch criteria for this event
        const criteriaData = await mockAPI.getCriteriaByEventId(params.id)
        setCriteria(criteriaData)
        
        // Fetch judges (participants) for this event
        const participations = await mockAPI.getEventParticipationsByEventId(params.id)
        const approvedParticipations = participations.filter(p => p.status === 'approved')
        
        // Get judge details
        const judgeDetails = await Promise.all(
          participations.map(async (p) => {
            const user = await mockAPI.getUserById(p.userId)
            if (!user) return null
            
            // Get ratings by this judge
            const ratings = await mockAPI.getRatingsByJudgeId(p.userId)
            const projectRatings = ratings.filter(r => r.eventId === params.id)
            
            // Count unique projects rated
            const uniqueProjectsRated = new Set(projectRatings.map(r => r.projectId)).size
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              projectsRated: uniqueProjectsRated,
              status: p.status === 'approved' ? 'Active' : 'Pending',
              participationId: p.id,
            }
          })
        )
        
        // Filter out null values
        const validJudges = judgeDetails.filter(j => j !== null) as any[]
        setJudges(validJudges)
        
        // Calculate stats
        const totalProjects = projectsData.length
        const totalJudges = approvedParticipations.length
        const completedJudges = validJudges.filter(j => j.status === 'Active' && j.projectsRated === totalProjects).length
        const judgeProgress = totalJudges > 0 ? (completedJudges / totalJudges) * 100 : 0
        
        setStats({
          totalProjects,
          totalJudges,
          completedJudges,
          judgeProgress,
        })
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching event data:", error)
        setLoading(false)
      }
    }
    
    fetchEventData()
  }, [params.id])
  
  // Handle judge approval/rejection
  const handleJudgeStatusChange = async (participationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await mockAPI.updateEventParticipation(participationId, { status: newStatus })
      
      // Update local state
      setJudges(prevJudges => 
        prevJudges.map(judge => 
          judge.participationId === participationId 
            ? { ...judge, status: newStatus === 'approved' ? 'Active' : 'Rejected' } 
            : judge
        )
      )
      
      toast({
        title: `Judge ${newStatus === 'approved' ? 'approved' : 'rejected'}`,
        description: `The judge has been ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully.`,
      })
    } catch (error) {
      console.error("Error updating judge status:", error)
      toast({
        title: "Error",
        description: "Failed to update judge status. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Calculate project rankings
  const calculateProjectRankings = () => {
    if (!projects.length) return []
    
    return [...projects].map(project => {
      // For a real app, we would calculate the average rating based on actual ratings
      // For now, we'll generate a random rating between 7 and 9.5
      const averageRating = 7 + Math.random() * 2.5
      const judgesRated = Math.floor(Math.random() * stats.totalJudges) + 1
      
      return {
        ...project,
        averageRating: parseFloat(averageRating.toFixed(1)),
        judgesRated,
      }
    }).sort((a, b) => b.averageRating - a.averageRating)
    .map((project, index) => ({
      ...project,
      rank: index + 1,
    }))
  }
  
  const rankedProjects = calculateProjectRankings()

  return (
    <AdminLayout>
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-6">
            <div className="h-8 w-1/3 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-1/4 animate-pulse rounded bg-muted"></div>
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="h-5 w-1/3 animate-pulse rounded bg-muted"></div>
                  <div className="mt-2 h-8 w-1/4 animate-pulse rounded bg-muted"></div>
                </div>
              ))}
            </div>
          </div>
        ) : !event ? (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">Event not found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/admin/events">
              <Button variant="outline">Back to Events</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
                <p className="text-muted-foreground">
                  {formatDateRange(event.startDate, event.endDate)} • 
                  <Badge className="ml-2">
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/events/${event.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
                  </Button>
                </Link>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Judges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalJudges}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Judging Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(stats.judgeProgress)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedJudges}/{stats.totalJudges} judges completed
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="results">
              <TabsList>
                <TabsTrigger value="results">
                  <BarChart className="mr-2 h-4 w-4" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="judges">
                  <Users className="mr-2 h-4 w-4" />
                  Judges
                </TabsTrigger>
              </TabsList>
              <TabsContent value="results" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Rankings</CardTitle>
                    <CardDescription>Current rankings based on normalized scores across all judges.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {rankedProjects.length === 0 ? (
                      <div className="flex h-32 items-center justify-center text-muted-foreground">
                        No projects found for this event.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left font-medium">Rank</th>
                              <th className="px-4 py-3 text-left font-medium">Project</th>
                              <th className="px-4 py-3 text-left font-medium">Team</th>
                              <th className="px-4 py-3 text-left font-medium">Avg. Rating</th>
                              <th className="px-4 py-3 text-left font-medium">Judges Rated</th>
                              <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rankedProjects.map((project) => (
                              <tr key={project.id} className="border-b">
                                <td className="px-4 py-3 font-medium">{project.rank}</td>
                                <td className="px-4 py-3">{project.name}</td>
                                <td className="px-4 py-3">{project.teamName}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <span className="font-medium">{project.averageRating}</span>
                                    <span className="text-muted-foreground">/10</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  {project.judgesRated}/{stats.totalJudges}
                                </td>
                                <td className="px-4 py-3">
                                  <Button variant="ghost" size="sm">
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="judges" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Judges</CardTitle>
                    <CardDescription>Judges participating in this event and their progress.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {judges.length === 0 ? (
                      <div className="flex h-32 items-center justify-center text-muted-foreground">
                        No judges found for this event.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left font-medium">Name</th>
                              <th className="px-4 py-3 text-left font-medium">Email</th>
                              <th className="px-4 py-3 text-left font-medium">Projects Rated</th>
                              <th className="px-4 py-3 text-left font-medium">Status</th>
                              <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {judges.map((judge) => (
                              <tr key={judge.id} className="border-b">
                                <td className="px-4 py-3">{judge.name}</td>
                                <td className="px-4 py-3">{judge.email}</td>
                                <td className="px-4 py-3">
                                  {judge.projectsRated}/{stats.totalProjects}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      judge.status === "Active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    }`}
                                  >
                                    {judge.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {judge.status === "Pending" ? (
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="default" 
                                        size="sm"
                                        onClick={() => handleJudgeStatusChange(judge.participationId, 'approved')}
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleJudgeStatusChange(judge.participationId, 'rejected')}
                                      >
                                        Decline
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button variant="ghost" size="sm">
                                      View Ratings
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

