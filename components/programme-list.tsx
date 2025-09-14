"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { ReservationModal } from "@/components/reservation-modal"

interface Programme {
  id: string
  nomEquipe1: string
  nomEquipe2: string
  stadium: string
  date: string
  division: string
  prixA: number
  prixB: number
}

export function ProgrammeList() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null)

  useEffect(() => {
    fetchProgrammes()
  }, [])

  const fetchProgrammes = async () => {
    try {
      const response = await fetch("/api/programmes")
      if (response.ok) {
        const data = await response.json()
        setProgrammes(data)
      }
    } catch (error) {
      console.error("Error fetching programmes:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((programme) => (
          <Card key={programme.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                {programme.nomEquipe1} vs {programme.nomEquipe2}
              </CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Badge variant="outline">{programme.division}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(programme.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(programme.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{programme.stadium}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Prix des billets:</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Catégorie A</span>
                    <span className="font-semibold">{programme.prixA} FC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Catégorie B</span>
                    <span className="font-semibold">{programme.prixB} FC</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => setSelectedProgramme(programme)}>
                <Users className="h-4 w-4 mr-2" />
                Réserver des places
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {programmes.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun programme disponible</h3>
            <p className="text-gray-600">Il n'y a actuellement aucun événement programmé. Revenez plus tard !</p>
          </CardContent>
        </Card>
      )}

      {selectedProgramme && (
        <ReservationModal
          programme={selectedProgramme}
          onClose={() => setSelectedProgramme(null)}
          onSuccess={() => {
            setSelectedProgramme(null)
            // Optionally refresh the programmes list
          }}
        />
      )}
    </>
  )
}
