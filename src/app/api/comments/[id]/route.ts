import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await Promise.resolve(params)

    const comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
        include: { author: true }
    })

    if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.author.email !== session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.comment.delete({
        where: { id: Number(id) }
    })

    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 })
}
