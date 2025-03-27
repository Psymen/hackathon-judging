"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Event } from "@/lib/mock-data"
import { formatDateRange } from "@/lib/utils"
import { CalendarDays, Edit, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface EventCardProps {
  event: Event
  judgeCount: number
  projectCount: number
  onStatusChange?: (eventId: string, newStatus: 'upcoming' | 'active' | 'completed') => Promise<void>
}

export function EventCard({ event, judgeCount, projectCount, onStatusChange }: EventCardProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const { toast } = useToast()

  const handleStatusChange = async (newStatus: 'upcoming' | 'active' | 'completed') => {
    if (!onStatusChange) return
    
    setIsChangingStatus(true)
    try {
      await onStatusChange(event.id, newStatus)
      toast({
        title: "Status updated",
        description: `Event status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event status",
        variant: "destructive",
      })
    } finally {
      setIsChangingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case 'upcoming':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case 'completed':
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{event.name}</CardTitle>
          <Badge className={getStatusColor(event.status)}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatDateRange(event.startDate, event.endDate)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{judgeCount} Judges · {projectCount} Projects</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3">
        <div className="flex space-x-2">
          <Link href={`/admin/events/${event.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          <Link href={`/admin/events/${event.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
        {onStatusChange && (
          <div>
            {event.status === 'upcoming' && (
              <Button 
                size="sm" 
                onClick={() => handleStatusChange('active')}
                disabled={isChangingStatus}
              >
                Start Judging
              </Button>
            )}
            {event.status === 'active' && (
              <Button 
                size="sm" 
                onClick={() => handleStatusChange('completed')}
                disabled={isChangingStatus}
              >
                End Judging
              </Button>
            )}
            {event.status === 'completed' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleStatusChange('active')}
                disabled={isChangingStatus}
              >
                Reactivate
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}