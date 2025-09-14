import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "GESTIONNAIRE") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    // Get current month start
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    // Get total counts
    const [
      totalUsers,
      totalSpectateurs,
      totalGestionnaires,
      totalAdmins,
      totalProgrammes,
      totalReservations,
      totalRevenue,
      newUsersThisMonth,
      newReservationsThisMonth,
      revenueThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "SPECTATEUR" } }),
      prisma.user.count({ where: { role: "GESTIONNAIRE" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.programme.count(),
      prisma.reservation.count(),
      prisma.paiement.aggregate({
        _sum: { montant: true },
        where: { status: "COMPLETED" },
      }),
      prisma.user.count({
        where: { createdAt: { gte: currentMonth } },
      }),
      prisma.reservation.count({
        where: { dateReservation: { gte: currentMonth } },
      }),
      prisma.paiement.aggregate({
        _sum: { montant: true },
        where: {
          status: "COMPLETED",
          datePaiement: { gte: currentMonth },
        },
      }),
    ])

    const stats = {
      totalUsers,
      totalSpectateurs,
      totalGestionnaires,
      totalAdmins,
      totalProgrammes,
      totalReservations,
      totalRevenue: totalRevenue._sum.montant || 0,
      recentActivity: {
        newUsersThisMonth,
        newReservationsThisMonth,
        revenueThisMonth: revenueThisMonth._sum.montant || 0,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ message: "Erreur lors de la récupération des statistiques" }, { status: 500 })
  }
}
