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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "SPECTATEUR" | "GESTIONNAIRE" | "ADMIN"
  nomSpect?: string
  prenomSpect?: string
  villeSpect?: string
  numphone?: string
  nomAgent?: string
  prenomAgent?: string
  service?: string
}

interface UserModalProps {
  user?: User | null
  onClose: () => void
  onSuccess: () => void
}

export function UserModal({ user, onClose, onSuccess }: UserModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "SPECTATEUR" as "SPECTATEUR" | "GESTIONNAIRE" | "ADMIN",
    // Spectateur fields
    nomSpect: "",
    prenomSpect: "",
    villeSpect: "",
    numphone: "",
    // Agent fields
    nomAgent: "",
    prenomAgent: "",
    service: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: "", // Don't populate password for editing
        role: user.role,
        nomSpect: user.nomSpect || "",
        prenomSpect: user.prenomSpect || "",
        villeSpect: user.villeSpect || "",
        numphone: user.numphone || "",
        nomAgent: user.nomAgent || "",
        prenomAgent: user.prenomAgent || "",
        service: user.service || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const url = user ? `/api/admin/users/${user.id}` : "/api/admin/users"
      const method = user ? "PUT" : "POST"

      const payload: any = {
        email: formData.email,
        role: formData.role,
      }

      // Only include password for new users or if it's provided for existing users
      if (!user || formData.password) {
        payload.password = formData.password
      }

      // Include role-specific fields
      if (formData.role === "SPECTATEUR") {
        payload.nomSpect = formData.nomSpect
        payload.prenomSpect = formData.prenomSpect
        payload.villeSpect = formData.villeSpect
        payload.numphone = formData.numphone
        payload.name = `${formData.prenomSpect} ${formData.nomSpect}`
      } else {
        payload.nomAgent = formData.nomAgent
        payload.prenomAgent = formData.prenomAgent
        payload.service = formData.service
        payload.name = `${formData.prenomAgent} ${formData.nomAgent}`
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Modifier l'utilisateur" : "Créer un nouvel utilisateur"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Modifiez les informations de l'utilisateur existant"
              : "Remplissez les informations pour créer un nouvel utilisateur"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="utilisateur@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe {user && "(laisser vide pour ne pas modifier)"}</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required={!user}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value: any) => handleInputChange("role", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPECTATEUR">Spectateur</SelectItem>
                <SelectItem value="GESTIONNAIRE">Gestionnaire</SelectItem>
                <SelectItem value="ADMIN">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role === "SPECTATEUR" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomSpect">Nom</Label>
                  <Input
                    id="nomSpect"
                    placeholder="Nom de famille"
                    value={formData.nomSpect}
                    onChange={(e) => handleInputChange("nomSpect", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenomSpect">Prénom</Label>
                  <Input
                    id="prenomSpect"
                    placeholder="Prénom"
                    value={formData.prenomSpect}
                    onChange={(e) => handleInputChange("prenomSpect", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="villeSpect">Ville</Label>
                <Input
                  id="villeSpect"
                  placeholder="Ville de résidence"
                  value={formData.villeSpect}
                  onChange={(e) => handleInputChange("villeSpect", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numphone">Numéro de téléphone</Label>
                <Input
                  id="numphone"
                  type="tel"
                  placeholder="+243 XXX XXX XXX"
                  value={formData.numphone}
                  onChange={(e) => handleInputChange("numphone", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomAgent">Nom</Label>
                  <Input
                    id="nomAgent"
                    placeholder="Nom de famille"
                    value={formData.nomAgent}
                    onChange={(e) => handleInputChange("nomAgent", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenomAgent">Prénom</Label>
                  <Input
                    id="prenomAgent"
                    placeholder="Prénom"
                    value={formData.prenomAgent}
                    onChange={(e) => handleInputChange("prenomAgent", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Input
                  id="service"
                  placeholder="Service ou département"
                  value={formData.service}
                  onChange={(e) => handleInputChange("service", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <DialogFooter className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
