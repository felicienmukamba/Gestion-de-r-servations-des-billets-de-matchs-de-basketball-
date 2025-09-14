import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const programmes = await prisma.programme.findMany({
      where: {
        date: {
          gte: new Date(), // Only future programmes
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(programmes)
  } catch (error) {
    console.error("Error fetching programmes:", error)
    return NextResponse.json({ message: "Erreur lors de la récupération des programmes" }, { status: 500 })
  }
}
