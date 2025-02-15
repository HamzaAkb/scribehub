import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { postId, content } = body

    if (!postId || !content) {
        return NextResponse.json({ error: "Missing postId or content" }, { status: 400 })
    }

    const comment = await prisma.comment.create({
        data: {
            content,
            post: {
                connect: { id: Number(postId) }
            },
            author: {
                connect: { email: session.user.email }
            }
        }
    })

    return NextResponse.json(comment, { status: 201 })
}