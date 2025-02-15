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
    const { name } = body

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
        where: { email: session.user.email },
        data: { name }
    })

    return NextResponse.json(updatedUser, { status: 200 })
}
