"use client"

import type React from "react"

import { useState } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CreditCard, Smartphone, CheckCircle } from "lucide-react"

interface PaymentModalProps {
  reservation: {
    id: string
    nombreBillet: number
    typeReservation: string
    programme: {
      nomEquipe1: string
      nomEquipe2: string
      stadium: string
      date: string
    }
    paiement?: {
      montant: number
    }
  }
  onClose: () => void
  onSuccess: () => void
}

export function PaymentModal({ reservation, onClose, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"MOBILE_MONEY" | "CARD">("MOBILE_MONEY")
  const [paymentData, setPaymentData] = useState({
    phoneNumber: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: reservation.id,
          paymentMethod,
          paymentData,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || "Une erreur s'est produite lors du paiement.")
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
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

  if (success) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Paiement réussi !</h3>
            <p className="text-gray-600 mb-6">
              Votre paiement a été traité avec succès. Vous recevrez une confirmation par e-mail.
            </p>
            <Button onClick={onClose} className="w-full">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Paiement des billets</DialogTitle>
          <DialogDescription>Finalisez votre réservation en effectuant le paiement</DialogDescription>
        </DialogHeader>

        {/* Reservation Summary */}
        <Card className="bg-gray-50">
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-lg">
              {reservation.programme.nomEquipe1} vs {reservation.programme.nomEquipe2}
            </h3>
            <p className="text-sm text-gray-600">{formatDate(reservation.programme.date)}</p>
            <p className="text-sm text-gray-600">{reservation.programme.stadium}</p>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm">
                {reservation.nombreBillet} billet(s) - {reservation.typeReservation}
              </span>
              <span className="text-xl font-bold text-blue-600">
                {reservation.paiement?.montant?.toLocaleString()} FC
              </span>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Mode de paiement</Label>
            <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOBILE_MONEY">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Mobile Money</span>
                  </div>
                </SelectItem>
                <SelectItem value="CARD">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Carte bancaire</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "MOBILE_MONEY" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+243 XXX XXX XXX"
                  value={paymentData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">Vous recevrez un SMS pour confirmer le paiement sur ce numéro</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Nom sur la carte</Label>
                <Input
                  id="cardName"
                  placeholder="Nom complet"
                  value={paymentData.cardName}
                  onChange={(e) => handleInputChange("cardName", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Date d'expiration</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/AA"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Payer {reservation.paiement?.montant?.toLocaleString()} FC
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
