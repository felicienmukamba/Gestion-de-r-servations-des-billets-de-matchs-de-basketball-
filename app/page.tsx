"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Users, Calendar, Shield } from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (session) {
      // Redirect authenticated users to their appropriate dashboard
      switch (session.user.role) {
        case "ADMIN":
          router.push("/admin")
          break
        case "GESTIONNAIRE":
          router.push("/manager")
          break
        default:
          router.push("/dashboard")
      }
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Ticket className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Système de Billetterie</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Se connecter</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Créer un compte</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Réservez vos billets en toute simplicité</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez et réservez vos places pour les événements sportifs les plus passionnants. Paiement sécurisé et
            confirmation instantanée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Commencer maintenant
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                J'ai déjà un compte
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Pour les Spectateurs</CardTitle>
              <CardDescription>Réservez facilement vos billets et suivez vos réservations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Consultation des programmes</li>
                <li>• Réservation en ligne</li>
                <li>• Paiement sécurisé</li>
                <li>• Historique des réservations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Pour les Gestionnaires</CardTitle>
              <CardDescription>Gérez vos événements et suivez les réservations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Création de programmes</li>
                <li>• Gestion des événements</li>
                <li>• Suivi des réservations</li>
                <li>• Rapports détaillés</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Pour les Administrateurs</CardTitle>
              <CardDescription>Administration complète du système</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Gestion des utilisateurs</li>
                <li>• Statistiques du système</li>
                <li>• Configuration avancée</li>
                <li>• Supervision globale</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Prêt à commencer ?</h3>
          <p className="text-gray-600 mb-6">
            Créez votre compte dès maintenant et découvrez tous nos événements disponibles.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Créer mon compte gratuitement</Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Système de Billetterie. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
