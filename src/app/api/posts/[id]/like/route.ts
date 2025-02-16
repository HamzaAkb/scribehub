import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await Promise.resolve(params)

    const updatedPost = await prisma.post.update({
        where: { id: Number(id) },
        data: { likes: { increment: 1 } }
    })

    return NextResponse.json(updatedPost, { status: 200 })
}
