"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ManagerDashboard } from "@/components/manager-dashboard"
import { Loader2 } from "lucide-react"

export default function ManagerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user.role !== "GESTIONNAIRE" && session.user.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session || (session.user.role !== "GESTIONNAIRE" && session.user.role !== "ADMIN")) {
    return null
  }

  return <ManagerDashboard />
}
