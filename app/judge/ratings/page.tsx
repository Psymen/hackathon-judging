import JudgeLayout from "@/components/judge-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function JudgeRatingsPage() {
  // Mock data for ratings
  const ratings = [
    {
      id: 1,
      project: "EcoTrack",
      event: "Summer Hackathon 2025",
      team: "Green Innovators",
      date: "Jun 15, 2025",
      averageRating: 8.5,
      status: "Submitted",
    },
    {
      id: 2,
      project: "MediConnect",
      event: "Summer Hackathon 2025",
      team: "Health Tech Solutions",
      date: "Jun 15, 2025",
      averageRating: 7.8,
      status: "Submitted",
    },
    {
      id: 3,
      project: "SmartBudget",
      event: "Summer Hackathon 2025",
      team: "FinTech Wizards",
      date: "Jun 15, 2025",
      averageRating: 9.2,
      status: "Submitted",
    },
    {
      id: 4,
      project: "VirtualAssistant",
      event: "AI Innovation Challenge",
      team: "AI Pioneers",
      date: "May 5, 2025",
      averageRating: 8.7,
      status: "Submitted",
    },
    {
      id: 5,
      project: "DataViz",
      event: "AI Innovation Challenge",
      team: "Visualization Experts",
      date: "May 5, 2025",
      averageRating: 7.5,
      status: "Submitted",
    },
  ]

  return (
    <JudgeLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Ratings</h1>
          <p className="text-muted-foreground">View all your submitted project ratings.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search ratings..." className="pl-8" />
          </div>
          <Button variant="outline">
            <CalendarDays className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Ratings</CardTitle>
            <CardDescription>View all your submitted project ratings across events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">Project</th>
                    <th className="px-4 py-3 text-left font-medium">Team</th>
                    <th className="px-4 py-3 text-left font-medium">Event</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Rating</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((rating) => (
                    <tr key={rating.id} className="border-b">
                      <td className="px-4 py-3">{rating.project}</td>
                      <td className="px-4 py-3">{rating.team}</td>
                      <td className="px-4 py-3">{rating.event}</td>
                      <td className="px-4 py-3">{rating.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="font-medium">{rating.averageRating}</span>
                          <span className="text-muted-foreground">/10</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {rating.status}
                        </span>
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
      </div>
    </JudgeLayout>
  )
}

