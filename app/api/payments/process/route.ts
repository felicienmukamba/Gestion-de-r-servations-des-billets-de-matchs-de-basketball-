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

    const { reservationId, paymentMethod, paymentData } = await request.json()

    // Get the reservation with payment info
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { paiement: true, spectateur: true },
    })

    if (!reservation) {
      return NextResponse.json({ message: "Réservation non trouvée" }, { status: 404 })
    }

    if (reservation.spectateurId !== session.user.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    if (!reservation.paiement) {
      return NextResponse.json({ message: "Aucun paiement associé à cette réservation" }, { status: 400 })
    }

    if (reservation.paiement.status === "COMPLETED") {
      return NextResponse.json({ message: "Cette réservation a déjà été payée" }, { status: 400 })
    }

    // Simulate payment processing
    const paymentSuccess = await processPayment(paymentMethod, paymentData, reservation.paiement.montant)

    if (paymentSuccess) {
      // Update payment status
      const updatedPayment = await prisma.paiement.update({
        where: { id: reservation.paiement.id },
        data: {
          status: "COMPLETED",
          modePaiement: paymentMethod,
          datePaiement: new Date(),
        },
      })

      // Send confirmation email (simulated)
      await sendPaymentConfirmation(reservation.spectateur.email, reservation)

      return NextResponse.json({
        message: "Paiement traité avec succès",
        payment: updatedPayment,
      })
    } else {
      // Update payment status to failed
      await prisma.paiement.update({
        where: { id: reservation.paiement.id },
        data: {
          status: "FAILED",
        },
      })

      return NextResponse.json({ message: "Le paiement a échoué. Veuillez réessayer." }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ message: "Erreur lors du traitement du paiement" }, { status: 500 })
  }
}

// Simulate payment processing
async function processPayment(method: string, data: any, amount: number): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  if (method === "MOBILE_MONEY") {
    // Validate phone number format
    const phoneRegex = /^\+243\d{9}$/
    if (!phoneRegex.test(data.phoneNumber)) {
      return false
    }
    // Simulate mobile money processing (90% success rate)
    return Math.random() > 0.1
  } else if (method === "CARD") {
    // Basic card validation
    if (!data.cardNumber || !data.expiryDate || !data.cvv || !data.cardName) {
      return false
    }
    // Simulate card processing (95% success rate)
    return Math.random() > 0.05
  }

  return false
}

// Simulate sending confirmation email
async function sendPaymentConfirmation(email: string, reservation: any): Promise<void> {
  console.log(`[v0] Sending payment confirmation email to ${email}`)
  console.log(`[v0] Reservation details:`, {
    id: reservation.id,
    match: `${reservation.programme?.nomEquipe1} vs ${reservation.programme?.nomEquipe2}`,
    amount: reservation.paiement?.montant,
  })
  // In a real application, you would integrate with an email service like SendGrid, Mailgun, etc.
}
