"use client"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, History, LogOut, Ticket } from "lucide-react"
import { ProgrammeList } from "@/components/programme-list"
import { ReservationHistory } from "@/components/reservation-history"

export function SpectatorDashboard() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Ticket className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Système de Billetterie</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Bienvenue, {session?.user?.name}</span>
              <Badge variant="secondary">Spectateur</Badge>
              <Button variant="outline" size="sm" onClick={() => signOut()} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord Spectateur</h2>
          <p className="text-gray-600">Découvrez les programmes disponibles et gérez vos réservations</p>
        </div>

        <Tabs defaultValue="programmes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="programmes" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Programmes Disponibles</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Mes Réservations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programmes">
            <ProgrammeList />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
