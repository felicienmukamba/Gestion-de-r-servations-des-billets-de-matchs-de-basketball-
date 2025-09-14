"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

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

interface ProgrammeModalProps {
  programme?: Programme | null
  onClose: () => void
  onSuccess: () => void
}

export function ProgrammeModal({ programme, onClose, onSuccess }: ProgrammeModalProps) {
  // Hard-coded list of teams and stadiums from the provided image
  const teams = [
    "BC CHAUX SPORT",
    "BC HODARI",
    "BC KABONO",
    "BC THE KING'S",
    "ASB AMI BK",
    "BC PANZI",
    "BC MAENDELEE",
  ]
  const stadiums = ["UEA", "ISP"]

  const [formData, setFormData] = useState({
    nomEquipe1: "",
    nomEquipe2: "",
    stadium: "",
    date: "",
    division: "",
    prixA: "",
    prixB: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (programme) {
      setFormData({
        nomEquipe1: programme.nomEquipe1,
        nomEquipe2: programme.nomEquipe2,
        stadium: programme.stadium,
        date: new Date(programme.date).toISOString().slice(0, 16),
        division: programme.division || "",
        prixA: programme.prixA.toString(),
        prixB: programme.prixB.toString(),
      })
    }
  }, [programme])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const url = programme ? `/api/manager/programmes/${programme.id}` : "/api/manager/programmes"

      const method = programme ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          prixA: Number.parseFloat(formData.prixA),
          prixB: Number.parseFloat(formData.prixB),
          date: new Date(formData.date).toISOString(),
        }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        setError(data.message || "Une erreur s'est produite.")
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{programme ? "Modifier le programme" : "Créer un nouveau programme"}</DialogTitle>
          <DialogDescription>
            {programme
              ? "Modifiez les informations du programme existant"
              : "Remplissez les informations pour créer un nouveau programme"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomEquipe1">Équipe 1</Label>
              <Input
                id="nomEquipe1"
                list="teams"
                placeholder="Nom de l'équipe 1"
                value={formData.nomEquipe1}
                onChange={(e) => handleInputChange("nomEquipe1", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomEquipe2">Équipe 2</Label>
              <Input
                id="nomEquipe2"
                list="teams"
                placeholder="Nom de l'équipe 2"
                value={formData.nomEquipe2}
                onChange={(e) => handleInputChange("nomEquipe2", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <datalist id="teams">
            {teams.map((team, index) => (
              <option key={index} value={team} />
            ))}
          </datalist>

          <div className="space-y-2">
            <Label htmlFor="stadium">Stade</Label>
            <Input
              id="stadium"
              list="stadiums"
              placeholder="Nom du stade"
              value={formData.stadium}
              onChange={(e) => handleInputChange("stadium", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <datalist id="stadiums">
            {stadiums.map((stadium, index) => (
              <option key={index} value={stadium} />
            ))}
          </datalist>

          <div className="space-y-2">
            <Label htmlFor="date">Date et heure</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="division">Division</Label>
            <Input
              id="division"
              placeholder="Division (ex: Ligue 1, Coupe, etc.)"
              value={formData.division}
              onChange={(e) => handleInputChange("division", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prixA">Prix Catégorie A (FC)</Label>
              <Input
                id="prixA"
                type="number"
                placeholder="Prix catégorie A"
                value={formData.prixA}
                onChange={(e) => handleInputChange("prixA", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prixB">Prix Catégorie B (FC)</Label>
              <Input
                id="prixB"
                type="number"
                placeholder="Prix catégorie B"
                value={formData.prixB}
                onChange={(e) => handleInputChange("prixB", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {programme ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
