import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || (session.user.role !== "GESTIONNAIRE" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { nomEquipe1, nomEquipe2, stadium, date, division, prixA, prixB } = await request.json()

    const programme = await prisma.programme.update({
      where: {
        id: params.id,
        createdBy: session.user.id, // Ensure user can only update their own programmes
      },
      data: {
        nomEquipe1,
        nomEquipe2,
        stadium,
        date: new Date(date),
        division,
        prixA,
        prixB,
      },
    })

    return NextResponse.json(programme)
  } catch (error) {
    console.error("Error updating programme:", error)
    return NextResponse.json({ message: "Erreur lors de la mise à jour du programme" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || (session.user.role !== "GESTIONNAIRE" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    // Delete related reservations and payments first
    await prisma.paiement.deleteMany({
      where: {
        reservation: {
          programmeId: params.id,
        },
      },
    })

    await prisma.reservation.deleteMany({
      where: {
        programmeId: params.id,
      },
    })

    // Then delete the programme
    await prisma.programme.delete({
      where: {
        id: params.id,
        createdBy: session.user.id, // Ensure user can only delete their own programmes
      },
    })

    return NextResponse.json({ message: "Programme supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting programme:", error)
    return NextResponse.json({ message: "Erreur lors de la suppression du programme" }, { status: 500 })
  }
}
