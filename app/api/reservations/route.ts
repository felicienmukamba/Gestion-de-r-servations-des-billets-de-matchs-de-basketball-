import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { programmeId, nombreBillet, typeReservation } = await request.json()

    // Get programme details to calculate price
    const programme = await prisma.programme.findUnique({
      where: { id: programmeId },
    })

    if (!programme) {
      return NextResponse.json({ message: "Programme non trouvé" }, { status: 404 })
    }

    // Calculate price based on type
    let prixUnitaire = programme.prixB // Default to category B
    if (typeReservation === "PREMIUM") {
      prixUnitaire = programme.prixA
    } else if (typeReservation === "VIP") {
      prixUnitaire = programme.prixA * 1.5
    }

    const montantTotal = prixUnitaire * nombreBillet

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        spectateurId: session.user.id,
        programmeId,
        nombreBillet,
        typeReservation: typeReservation as any,
      },
      include: {
        programme: true,
      },
    })

    // Create pending payment
    await prisma.paiement.create({
      data: {
        reservationId: reservation.id,
        montant: montantTotal,
        modePaiement: "MOBILE_MONEY", // Default
        status: "PENDING",
      },
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ message: "Erreur lors de la création de la réservation" }, { status: 500 })
  }
}
