"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, CalendarDays, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { mockAPI } from "@/lib/mock-data"
import { formatDateRange, getRelativeTime } from "@/lib/utils"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeEvents: 0,
    totalJudges: 0,
    projectsJudged: 0,
    pendingApprovals: 0,
  })
  
  const [recentEvents, setRecentEvents] = useState<any[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsData = await mockAPI.getEventStats()
        setStats(statsData)
        
        // Fetch recent events
        const eventsData = await mockAPI.getRecentEvents(3)
        setRecentEvents(eventsData)
        
        // Fetch pending approvals
        const approvalsData = await mockAPI.getPendingApprovals()
        
        // Get user and event details for each approval
        const detailedApprovals = await Promise.all(
          approvalsData.map(async (approval) => {
            const user = await mockAPI.getUserById(approval.userId)
            const event = await mockAPI.getEventById(approval.eventId)
            return {
              ...approval,
              judgeName: user?.name || 'Unknown',
              judgeEmail: user?.email || 'unknown@example.com',
              eventName: event?.name || 'Unknown Event',
              requestedTime: getRelativeTime(approval.createdAt),
            }
          })
        )
        
        setPendingApprovals(detailedApprovals)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Format stats for display
  const statsDisplay = [
    { name: "Active Events", value: stats.activeEvents.toString(), icon: CalendarDays },
    { name: "Total Judges", value: stats.totalJudges.toString(), icon: Users },
    { name: "Projects Judged", value: stats.projectsJudged.toString(), icon: Trophy },
    { name: "Pending Approvals", value: stats.pendingApprovals.toString(), icon: Award },
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

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex animate-pulse items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-24 rounded bg-muted"></div>
                      <div className="h-7 w-12 rounded bg-muted"></div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-muted"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsDisplay.map((stat) => (
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
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Overview of your recent and upcoming hackathon events.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex animate-pulse items-center space-x-4">
                    <div className="h-4 w-1/4 rounded bg-muted"></div>
                    <div className="h-4 w-1/6 rounded bg-muted"></div>
                    <div className="h-4 w-1/6 rounded bg-muted"></div>
                    <div className="h-4 w-1/12 rounded bg-muted"></div>
                    <div className="h-4 w-1/12 rounded bg-muted"></div>
                    <div className="h-8 w-16 rounded bg-muted"></div>
                  </div>
                ))}
              </div>
            ) : (
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
                        <td className="px-4 py-3">{formatDateRange(event.startDate, event.endDate)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              event.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Judge Approvals</CardTitle>
            <CardDescription>Judges waiting for approval to participate in events.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex animate-pulse items-center space-x-4">
                    <div className="h-4 w-1/6 rounded bg-muted"></div>
                    <div className="h-4 w-1/4 rounded bg-muted"></div>
                    <div className="h-4 w-1/6 rounded bg-muted"></div>
                    <div className="h-4 w-1/12 rounded bg-muted"></div>
                    <div className="h-8 w-32 rounded bg-muted"></div>
                  </div>
                ))}
              </div>
            ) : pendingApprovals.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No pending approvals at this time.
              </div>
            ) : (
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
                    {pendingApprovals.map((approval) => (
                      <tr key={approval.id} className="border-b">
                        <td className="px-4 py-3">{approval.judgeName}</td>
                        <td className="px-4 py-3">{approval.judgeEmail}</td>
                        <td className="px-4 py-3">{approval.eventName}</td>
                        <td className="px-4 py-3">{approval.requestedTime}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={async () => {
                                await mockAPI.updateEventParticipation(approval.id, { status: 'approved' });
                                // Refresh data
                                const approvalsData = await mockAPI.getPendingApprovals();
                                const detailedApprovals = await Promise.all(
                                  approvalsData.map(async (a) => {
                                    const user = await mockAPI.getUserById(a.userId);
                                    const event = await mockAPI.getEventById(a.eventId);
                                    return {
                                      ...a,
                                      judgeName: user?.name || 'Unknown',
                                      judgeEmail: user?.email || 'unknown@example.com',
                                      eventName: event?.name || 'Unknown Event',
                                      requestedTime: getRelativeTime(a.createdAt),
                                    };
                                  })
                                );
                                setPendingApprovals(detailedApprovals);
                              }}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                await mockAPI.updateEventParticipation(approval.id, { status: 'rejected' });
                                // Refresh data
                                const approvalsData = await mockAPI.getPendingApprovals();
                                const detailedApprovals = await Promise.all(
                                  approvalsData.map(async (a) => {
                                    const user = await mockAPI.getUserById(a.userId);
                                    const event = await mockAPI.getEventById(a.eventId);
                                    return {
                                      ...a,
                                      judgeName: user?.name || 'Unknown',
                                      judgeEmail: user?.email || 'unknown@example.com',
                                      eventName: event?.name || 'Unknown Event',
                                      requestedTime: getRelativeTime(a.createdAt),
                                    };
                                  })
                                );
                                setPendingApprovals(detailedApprovals);
                              }}
                            >
                              Decline
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

