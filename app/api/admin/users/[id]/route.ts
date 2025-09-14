import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const data = await request.json()
    const { email, password, role, name, ...roleSpecificData } = data

    // Prepare update data
    const updateData: any = {
      email,
      role,
      name,
      ...roleSpecificData,
    }

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        nomSpect: true,
        prenomSpect: true,
        villeSpect: true,
        numphone: true,
        nomAgent: true,
        prenomAgent: true,
        service: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Erreur lors de la mise à jour de l'utilisateur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    // Delete related data first
    await prisma.paiement.deleteMany({
      where: {
        reservation: {
          spectateurId: params.id,
        },
      },
    })

    await prisma.reservation.deleteMany({
      where: {
        spectateurId: params.id,
      },
    })

    await prisma.programme.deleteMany({
      where: {
        createdBy: params.id,
      },
    })

    // Delete user
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Erreur lors de la suppression de l'utilisateur" }, { status: 500 })
  }
}
