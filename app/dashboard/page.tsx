"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SpectatorDashboard } from "@/components/spectator-dashboard"
import { ManagerDashboard } from "@/components/manager-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Redirect based on role
    switch (session.user.role) {
      case "ADMIN":
        router.push("/admin")
        break
      case "GESTIONNAIRE":
        router.push("/manager")
        break
      // SPECTATEUR stays on /dashboard
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Render appropriate dashboard based on role
  switch (session.user.role) {
    case "SPECTATEUR":
      return <SpectatorDashboard />
    case "GESTIONNAIRE":
      return <ManagerDashboard />
    case "ADMIN":
      return <AdminDashboard />
    default:
      return <SpectatorDashboard />
  }
}
