import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { reservationId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.reservationId },
      include: {
        paiement: true,
        programme: true,
      },
    })

    if (!reservation) {
      return NextResponse.json({ message: "Réservation non trouvée" }, { status: 404 })
    }

    // Allow access for the reservation owner or admin/manager
    if (
      reservation.spectateurId !== session.user.id &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "GESTIONNAIRE"
    ) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    return NextResponse.json({
      reservation: {
        id: reservation.id,
        dateReservation: reservation.dateReservation,
        typeReservation: reservation.typeReservation,
        nombreBillet: reservation.nombreBillet,
        programme: reservation.programme,
      },
      payment: reservation.paiement
        ? {
            id: reservation.paiement.id,
            montant: reservation.paiement.montant,
            status: reservation.paiement.status,
            modePaiement: reservation.paiement.modePaiement,
            datePaiement: reservation.paiement.datePaiement,
          }
        : null,
    })
  } catch (error) {
    console.error("Error fetching payment status:", error)
    return NextResponse.json({ message: "Erreur lors de la récupération du statut de paiement" }, { status: 500 })
  }
}
