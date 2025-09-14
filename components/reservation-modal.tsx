"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Calendar, MapPin } from "lucide-react"

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

interface ReservationModalProps {
  programme: Programme
  onClose: () => void
  onSuccess: () => void
}

export function ReservationModal({ programme, onClose, onSuccess }: ReservationModalProps) {
  const { data: session } = useSession()
  const [nombreBillet, setNombreBillet] = useState(1)
  const [typeReservation, setTypeReservation] = useState<"STANDARD" | "VIP" | "PREMIUM">("STANDARD")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const getPrix = () => {
    switch (typeReservation) {
      case "PREMIUM":
        return programme.prixA
      case "VIP":
        return programme.prixA * 1.5
      default:
        return programme.prixB
    }
  }

  const getTotalPrice = () => {
    return getPrix() * nombreBillet
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programmeId: programme.id,
          nombreBillet,
          typeReservation,
        }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        setError(data.message || "Une erreur s'est produite lors de la réservation.")
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Réserver des places</DialogTitle>
          <DialogDescription>Réservez vos billets pour ce match</DialogDescription>
        </DialogHeader>

        {/* Match Info */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h3 className="font-semibold text-lg">
            {programme.nomEquipe1} vs {programme.nomEquipe2}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(programme.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{programme.stadium}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="typeReservation">Type de place</Label>
            <Select value={typeReservation} onValueChange={(value: any) => setTypeReservation(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STANDARD">Standard - {programme.prixB} FC</SelectItem>
                <SelectItem value="PREMIUM">Premium - {programme.prixA} FC</SelectItem>
                <SelectItem value="VIP">VIP - {Math.round(programme.prixA * 1.5)} FC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombreBillet">Nombre de billets</Label>
            <Input
              id="nombreBillet"
              type="number"
              min="1"
              max="10"
              value={nombreBillet}
              onChange={(e) => setNombreBillet(Number.parseInt(e.target.value) || 1)}
              disabled={isLoading}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total à payer:</span>
              <span className="text-xl font-bold text-blue-600">{getTotalPrice().toLocaleString()} FC</span>
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer la réservation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
