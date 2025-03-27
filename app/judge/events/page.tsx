import JudgeLayout from "@/components/judge-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function JudgeEventsPage() {
  // Mock data for events
  const events = [
    {
      id: 1,
      name: "Summer Hackathon 2025",
      date: "Jun 15-16, 2025",
      status: "Active",
      description: "A two-day event focused on innovative solutions for climate change.",
      joined: true,
    },
    {
      id: 2,
      name: "AI Innovation Challenge",
      date: "May 5-6, 2025",
      status: "Completed",
      description: "Exploring the frontiers of artificial intelligence and machine learning.",
      joined: true,
    },
    {
      id: 3,
      name: "Web3 Developers Jam",
      date: "Apr 20-21, 2025",
      status: "Upcoming",
      description: "Building the future of decentralized applications and blockchain technology.",
      joined: false,
    },
  ]

  return (
    <JudgeLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hackathon Events</h1>
          <p className="text-muted-foreground">View and join hackathon events for judging.</p>
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
                            : event.status === "Upcoming"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {event.joined ? (
                      <Link href={`/judge/events/${event.id}`}>
                        <Button variant="default" size="sm">
                          {event.status === "Active" ? "Continue Judging" : "View Details"}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm">
                        Request to Join
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </JudgeLayout>
  )
}

