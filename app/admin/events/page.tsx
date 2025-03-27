import AdminLayout from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function EventsPage() {
  // Mock data for events
  const events = [
    {
      id: 1,
      name: "Summer Hackathon 2025",
      date: "Jun 15-16, 2025",
      status: "Active",
      judges: 8,
      projects: 32,
      description: "A two-day event focused on innovative solutions for climate change.",
    },
    {
      id: 2,
      name: "AI Innovation Challenge",
      date: "May 5-6, 2025",
      status: "Completed",
      judges: 12,
      projects: 45,
      description: "Exploring the frontiers of artificial intelligence and machine learning.",
    },
    {
      id: 3,
      name: "Web3 Developers Jam",
      date: "Apr 20-21, 2025",
      status: "Completed",
      judges: 10,
      projects: 38,
      description: "Building the future of decentralized applications and blockchain technology.",
    },
    {
      id: 4,
      name: "Mobile App Hackathon",
      date: "Mar 10-11, 2025",
      status: "Completed",
      judges: 8,
      projects: 27,
      description: "Creating innovative mobile applications to solve everyday problems.",
    },
    {
      id: 5,
      name: "Health Tech Summit",
      date: "Feb 15-16, 2025",
      status: "Completed",
      judges: 14,
      projects: 42,
      description: "Developing technology solutions for healthcare challenges.",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground">Manage your hackathon events and judging criteria.</p>
          </div>
          <Link href="/admin/events/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search events..." className="pl-8" />
          </div>
          <Button variant="outline">
            <CalendarDays className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {event.date}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          event.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/events/${event.id}`}>
                      <Button variant="default" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      End Judging
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

