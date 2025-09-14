"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, UserCheck } from "lucide-react"
import { UserModal } from "@/components/user-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  createdAt: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.nomSpect?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.prenomSpect?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.nomAgent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.prenomAgent?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== id))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const handleModalSuccess = () => {
    fetchUsers()
    handleModalClose()
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-red-100 text-red-800">Administrateur</Badge>
      case "GESTIONNAIRE":
        return <Badge className="bg-green-100 text-green-800">Gestionnaire</Badge>
      default:
        return <Badge variant="secondary">Spectateur</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
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
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Utilisateurs du système</h3>
          <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouvel Utilisateur</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="SPECTATEUR">Spectateurs</SelectItem>
              <SelectItem value="GESTIONNAIRE">Gestionnaires</SelectItem>
              <SelectItem value="ADMIN">Administrateurs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{user.name || "Nom non défini"}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                  {getRoleBadge(user.role)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {user.role === "SPECTATEUR" && (
                    <>
                      {user.nomSpect && (
                        <div className="text-sm">
                          <span className="font-medium">Nom complet:</span> {user.prenomSpect} {user.nomSpect}
                        </div>
                      )}
                      {user.villeSpect && (
                        <div className="text-sm">
                          <span className="font-medium">Ville:</span> {user.villeSpect}
                        </div>
                      )}
                      {user.numphone && (
                        <div className="text-sm">
                          <span className="font-medium">Téléphone:</span> {user.numphone}
                        </div>
                      )}
                    </>
                  )}

                  {(user.role === "GESTIONNAIRE" || user.role === "ADMIN") && (
                    <>
                      {user.nomAgent && (
                        <div className="text-sm">
                          <span className="font-medium">Nom complet:</span> {user.prenomAgent} {user.nomAgent}
                        </div>
                      )}
                      {user.service && (
                        <div className="text-sm">
                          <span className="font-medium">Service:</span> {user.service}
                        </div>
                      )}
                    </>
                  )}

                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Créé le:</span> {formatDate(user.createdAt)}
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setSelectedUser(user)
                      setShowModal(true)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => setDeleteId(user.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-8">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || roleFilter !== "all"
                  ? "Aucun utilisateur ne correspond à vos critères de recherche."
                  : "Il n'y a encore aucun utilisateur dans le système."}
              </p>
              {!searchTerm && roleFilter === "all" && (
                <Button onClick={() => setShowModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le premier utilisateur
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {showModal && <UserModal user={selectedUser} onClose={handleModalClose} onSuccess={handleModalSuccess} />}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera également
              toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
