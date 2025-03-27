"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { useState } from "react"

interface EventFiltersProps {
  onFilterChange: (filters: EventFilters) => void
  initialFilters?: EventFilters
}

export interface EventFilters {
  search: string
  status: string
  sortBy: string
}

export function EventFilters({ onFilterChange, initialFilters }: EventFiltersProps) {
  const [filters, setFilters] = useState<EventFilters>(initialFilters || {
    search: '',
    status: 'all',
    sortBy: 'newest',
  })

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearSearch = () => {
    const newFilters = { ...filters, search: '' }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      status: 'all',
      sortBy: 'newest',
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search events..."
              className="pl-8"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row md:w-auto">
          <div className="w-full sm:w-[150px]">
            <Label htmlFor="status" className="sr-only">
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-[150px]">
            <Label htmlFor="sort" className="sr-only">
              Sort By
            </Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={handleResetFilters} className="sm:h-10">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}