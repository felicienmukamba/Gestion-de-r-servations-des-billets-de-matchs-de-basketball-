"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, CreditCard, Clock } from "lucide-react"
import { PaymentModal } from "@/components/payment-modal"

interface Reservation {
  id: string
  dateReservation: string
  typeReservation: string
  nombreBillet: number
  programme: {
    nomEquipe1: string
    nomEquipe2: string
    stadium: string
    date: string
  }
  paiement?: {
    montant: number
    status: string
    datePaiement: string
  }
}

export function ReservationHistory() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations/my-reservations")
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "FAILED":
        return <Badge variant="destructive">Échec</Badge>
      default:
        return <Badge variant="secondary">Non payé</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handlePaymentSuccess = () => {
    setSelectedReservation(null)
    fetchReservations() // Refresh the list
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
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
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {reservation.programme.nomEquipe1} vs {reservation.programme.nomEquipe2}
                  </CardTitle>
                  <CardDescription>Réservation du {formatDate(reservation.dateReservation)}</CardDescription>
                </div>
                {getStatusBadge(reservation.paiement?.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(reservation.programme.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{reservation.programme.stadium}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {reservation.nombreBillet} billet(s) - {reservation.typeReservation}
                    </span>
                  </div>
                </div>

                {reservation.paiement && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CreditCard className="h-4 w-4" />
                      <span>Montant: {reservation.paiement.montant.toLocaleString()} FC</span>
                    </div>
                    {reservation.paiement.status === "COMPLETED" && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Payé le {formatDate(reservation.paiement.datePaiement)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {reservation.paiement && reservation.paiement.status !== "COMPLETED" && (
                <div className="pt-4 border-t">
                  <Button className="w-full sm:w-auto" onClick={() => setSelectedReservation(reservation)}>
                    Procéder au paiement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {reservations.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
              <p className="text-gray-600">
                Vous n'avez encore effectué aucune réservation. Consultez les programmes disponibles !
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedReservation && (
        <PaymentModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  )
}
