import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Download, Edit, Users } from "lucide-react"
import Link from "next/link"

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  // Mock data for event details
  const event = {
    id: params.id,
    name: "Summer Hackathon 2025",
    date: "Jun 15-16, 2025",
    status: "Active",
    description: "A two-day event focused on innovative solutions for climate change.",
    judges: 8,
    projects: 32,
    criteria: [
      { id: 1, name: "Innovation", description: "How innovative is the solution?", weight: 30 },
      {
        id: 2,
        name: "Technical Complexity",
        description: "How technically complex is the implementation?",
        weight: 25,
      },
      { id: 3, name: "Design", description: "How well designed is the user interface and experience?", weight: 20 },
      { id: 4, name: "Practicality", description: "How practical and useful is the solution?", weight: 25 },
    ],
  }

  // Mock data for projects
  const projects = [
    {
      id: 1,
      name: "EcoTrack",
      team: "Green Innovators",
      description: "A mobile app that helps users track and reduce their carbon footprint.",
      averageRating: 8.7,
      judgesRated: 6,
      rank: 1,
    },
    {
      id: 2,
      name: "MediConnect",
      team: "Health Tech Solutions",
      description: "A platform connecting patients with healthcare providers for remote consultations.",
      averageRating: 8.4,
      judgesRated: 7,
      rank: 2,
    },
    {
      id: 3,
      name: "SmartBudget",
      team: "FinTech Wizards",
      description: "An AI-powered personal finance tool that helps users manage expenses.",
      averageRating: 8.2,
      judgesRated: 5,
      rank: 3,
    },
    {
      id: 4,
      name: "VirtualAssistant",
      team: "AI Pioneers",
      description: "A virtual assistant that helps users with daily tasks and reminders.",
      averageRating: 7.9,
      judgesRated: 8,
      rank: 4,
    },
    {
      id: 5,
      name: "DataViz",
      team: "Visualization Experts",
      description: "A data visualization tool that helps users understand complex datasets.",
      averageRating: 7.5,
      judgesRated: 6,
      rank: 5,
    },
  ]

  // Mock data for judges
  const judges = [
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", projectsRated: 5, status: "Active" },
    { id: 2, name: "Michael Chen", email: "michael@example.com", projectsRated: 5, status: "Active" },
    { id: 3, name: "Jessica Taylor", email: "jessica@example.com", projectsRated: 3, status: "Active" },
    { id: 4, name: "David Kim", email: "david@example.com", projectsRated: 4, status: "Active" },
    { id: 5, name: "Lisa Wang", email: "lisa@example.com", projectsRated: 5, status: "Active" },
    { id: 6, name: "James Wilson", email: "james@example.com", projectsRated: 4, status: "Active" },
    { id: 7, name: "Emily Rodriguez", email: "emily@example.com", projectsRated: 0, status: "Pending" },
    { id: 8, name: "Robert Johnson", email: "robert@example.com", projectsRated: 0, status: "Pending" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
            <p className="text-muted-foreground">
              {event.date} • {event.status}
            </p>
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
              <div className="text-2xl font-bold">{event.projects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Judges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{event.judges}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Judging Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground">6/8 judges completed</p>
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
                      {projects.map((project) => (
                        <tr key={project.id} className="border-b">
                          <td className="px-4 py-3 font-medium">{project.rank}</td>
                          <td className="px-4 py-3">{project.name}</td>
                          <td className="px-4 py-3">{project.team}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <span className="font-medium">{project.averageRating}</span>
                              <span className="text-muted-foreground">/10</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {project.judgesRated}/{event.judges}
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
                            {judge.projectsRated}/{event.projects}
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
                                <Button variant="default" size="sm">
                                  Approve
                                </Button>
                                <Button variant="outline" size="sm">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

