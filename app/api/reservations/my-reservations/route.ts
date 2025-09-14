import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        spectateurId: session.user.id,
      },
      include: {
        programme: true,
        paiement: true,
      },
      orderBy: {
        dateReservation: "desc",
      },
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ message: "Erreur lors de la récupération des réservations" }, { status: 500 })
  }
}
