"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, CreditCard, Clock, Search } from "lucide-react"

interface Reservation {
  id: string
  dateReservation: string
  typeReservation: string
  nombreBillet: number
  spectateur: {
    name: string
    email: string
  }
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

export function AllReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchReservations()
  }, [])

  useEffect(() => {
    filterReservations()
  }, [reservations, searchTerm, statusFilter])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/manager/reservations")
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

  const filterReservations = () => {
    let filtered = reservations

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.spectateur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.spectateur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.programme.nomEquipe1.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.programme.nomEquipe2.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((reservation) => {
        if (statusFilter === "paid") return reservation.paiement?.status === "COMPLETED"
        if (statusFilter === "pending") return reservation.paiement?.status === "PENDING"
        if (statusFilter === "unpaid") return !reservation.paiement
        return true
      })
    }

    setFilteredReservations(filtered)
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom, email ou équipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="paid">Payé</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="unpaid">Non payé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {reservation.programme.nomEquipe1} vs {reservation.programme.nomEquipe2}
                  </CardTitle>
                  <CardDescription>
                    Réservé par {reservation.spectateur.name} ({reservation.spectateur.email})
                  </CardDescription>
                </div>
                {getStatusBadge(reservation.paiement?.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Détails de l'événement</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(reservation.programme.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{reservation.programme.stadium}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Détails de la réservation</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {reservation.nombreBillet} billet(s) - {reservation.typeReservation}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Réservé le {formatDate(reservation.dateReservation)}</span>
                  </div>
                </div>

                {reservation.paiement && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">Informations de paiement</h4>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReservations.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Aucune réservation ne correspond à vos critères de recherche."
                : "Il n'y a encore aucune réservation dans le système."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
