import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, CalendarDays, Trophy, Users } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  // Mock data for dashboard
  const stats = [
    { name: "Active Events", value: "3", icon: CalendarDays },
    { name: "Total Judges", value: "24", icon: Users },
    { name: "Projects Judged", value: "87", icon: Trophy },
    { name: "Pending Approvals", value: "5", icon: Award },
  ]

  const recentEvents = [
    { id: 1, name: "Summer Hackathon 2025", date: "Jun 15-16, 2025", status: "Active", judges: 8, projects: 32 },
    { id: 2, name: "AI Innovation Challenge", date: "May 5-6, 2025", status: "Completed", judges: 12, projects: 45 },
    { id: 3, name: "Web3 Developers Jam", date: "Apr 20-21, 2025", status: "Completed", judges: 10, projects: 38 },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your hackathon events and judging activities.</p>
          </div>
          <Link href="/admin/events/new">
            <Button>
              <CalendarDays className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Overview of your recent and upcoming hackathon events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">Event Name</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Judges</th>
                    <th className="px-4 py-3 text-left font-medium">Projects</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event) => (
                    <tr key={event.id} className="border-b">
                      <td className="px-4 py-3">{event.name}</td>
                      <td className="px-4 py-3">{event.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            event.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{event.judges}</td>
                      <td className="px-4 py-3">{event.projects}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/events/${event.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Judge Approvals</CardTitle>
            <CardDescription>Judges waiting for approval to participate in events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">Judge Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Event</th>
                    <th className="px-4 py-3 text-left font-medium">Requested</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">Sarah Johnson</td>
                    <td className="px-4 py-3">sarah@example.com</td>
                    <td className="px-4 py-3">Summer Hackathon 2025</td>
                    <td className="px-4 py-3">2 hours ago</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button variant="default" size="sm">
                          Approve
                        </Button>
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3">Michael Chen</td>
                    <td className="px-4 py-3">michael@example.com</td>
                    <td className="px-4 py-3">Summer Hackathon 2025</td>
                    <td className="px-4 py-3">3 hours ago</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button variant="default" size="sm">
                          Approve
                        </Button>
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

