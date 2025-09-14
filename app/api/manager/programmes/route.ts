import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || (session.user.role !== "GESTIONNAIRE" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const programmes = await prisma.programme.findMany({
      where: {
        createdBy: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(programmes)
  } catch (error) {
    console.error("Error fetching programmes:", error)
    return NextResponse.json({ message: "Erreur lors de la récupération des programmes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || (session.user.role !== "GESTIONNAIRE" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { nomEquipe1, nomEquipe2, stadium, date, division, prixA, prixB } = await request.json()

    const programme = await prisma.programme.create({
      data: {
        nomEquipe1,
        nomEquipe2,
        stadium,
        date: new Date(date),
        division,
        prixA,
        prixB,
        createdBy: session.user.id,
      },
    })

    return NextResponse.json(programme, { status: 201 })
  } catch (error) {
    console.error("Error creating programme:", error)
    return NextResponse.json({ message: "Erreur lors de la création du programme" }, { status: 500 })
  }
}
