import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, imageUrl } = body

    if (!name && !imageUrl) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    const data: { name?: string; imageUrl?: string } = {}
    if (name) {
        data.name = name
    }
    if (imageUrl) {
        data.imageUrl = imageUrl
    }

    const updatedUser = await prisma.user.update({
        where: { email: session.user.email },
        data,
    })

    return NextResponse.json(updatedUser, { status: 200 })
}
