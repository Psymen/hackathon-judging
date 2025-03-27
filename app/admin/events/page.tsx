"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { EventCard } from "@/components/admin/events/event-card"
import { EventFilters, type EventFilters as EventFiltersType } from "@/components/admin/events/event-filters"
import { mockAPI, type Event } from "@/lib/mock-data"
import { useToast } from "@/components/ui/use-toast"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [eventStats, setEventStats] = useState<Record<string, { judges: number; projects: number }>>({})
  const { toast } = useToast()

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await mockAPI.getEvents()
        setEvents(eventsData)
        setFilteredEvents(eventsData)
        
        // Get judge and project counts for each event
        const stats: Record<string, { judges: number; projects: number }> = {}
        
        await Promise.all(
          eventsData.map(async (event) => {
            // Get judge count
            const participations = await mockAPI.getEventParticipationsByEventId(event.id)
            const approvedJudges = participations.filter(p => p.status === 'approved').length
            
            // Get project count
            const projects = await mockAPI.getProjectsByEventId(event.id)
            
            stats[event.id] = {
              judges: approvedJudges,
              projects: projects.length
            }
          })
        )
        
        setEventStats(stats)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching events:", error)
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])

  // Handle filter changes
  const handleFilterChange = (filters: EventFiltersType) => {
    let filtered = [...events]
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchTerm) || 
        event.description.toLowerCase().includes(searchTerm)
      )
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(event => event.status === filters.status)
    }
    
    // Sort events
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
    }
    
    setFilteredEvents(filtered)
  }
  
  // Handle event status change
  const handleStatusChange = async (eventId: string, newStatus: 'upcoming' | 'active' | 'completed') => {
    try {
      await mockAPI.updateEvent(eventId, { status: newStatus })
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      )
      
      setFilteredEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      )
      
      return Promise.resolve()
    } catch (error) {
      console.error("Error updating event status:", error)
      return Promise.reject(error)
    }
  }

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

        <EventFilters onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-6">
                <div className="space-y-3">
                  <div className="h-5 w-1/4 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                  <div className="flex gap-2">
                    <div className="h-4 w-1/6 animate-pulse rounded bg-muted"></div>
                    <div className="h-4 w-1/6 animate-pulse rounded bg-muted"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-4 text-lg font-semibold">No events found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
            <Button variant="outline" onClick={() => handleFilterChange({ search: '', status: 'all', sortBy: 'newest' })}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                judgeCount={eventStats[event.id]?.judges || 0}
                projectCount={eventStats[event.id]?.projects || 0}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

