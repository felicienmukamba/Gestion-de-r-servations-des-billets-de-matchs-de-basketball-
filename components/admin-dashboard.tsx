"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Settings, LogOut, Shield } from "lucide-react"
import { UserManagement } from "@/components/user-management"
import { SystemStats } from "@/components/system-stats"

export function AdminDashboard() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-red-600" />
              <h1 className="text-xl font-semibold text-gray-900">Panneau d'Administration</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Bienvenue, {session?.user?.name}</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Administrateur
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord Administrateur</h2>
          <p className="text-gray-600">Gérez les utilisateurs et supervisez le système</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Gestion des Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Statistiques du Système</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="stats">
            <SystemStats />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
