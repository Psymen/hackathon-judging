"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { register, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    
    try {
      const success = await register(name, email, password)
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please wait for admin approval.",
        })
        router.push("/judge/events")
      } else {
        setError("Email already in use or registration failed")
        toast({
          title: "Registration failed",
          description: "Email already in use or registration failed. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      setError("An error occurred during registration")
      toast({
        title: "Registration error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-6 w-6" />
            <span className="font-bold">HackJudge</span>
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your information to get started</p>
        </div>
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

