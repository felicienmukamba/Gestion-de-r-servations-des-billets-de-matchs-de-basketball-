"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, History, LogOut, Settings } from "lucide-react"
import { ProgrammeManagement } from "@/components/programme-management"
import { AllReservations } from "@/components/all-reservations"
import { SystemStatsManager } from "@/components/system-stats-manager"

export function ManagerDashboard() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-green-600" />
              <h1 className="text-xl font-semibold text-gray-900">Panneau de Gestion</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Bienvenue, {session?.user?.name}</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Gestionnaire
              </Badge>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord Gestionnaire</h2>
          <p className="text-gray-600">Gérez les programmes et consultez les réservations</p>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Statistiques du Système</span>
            </TabsTrigger>
            <TabsTrigger value="programmes" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Gestion des Programmes</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Toutes les Réservations</span>
            </TabsTrigger>
          </TabsList>
            <TabsContent value="stats">
                  <SystemStatsManager />
              </TabsContent>

          <TabsContent value="programmes">
            <ProgrammeManagement />
          </TabsContent>

          <TabsContent value="reservations">
            <AllReservations />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
