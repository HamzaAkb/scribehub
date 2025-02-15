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

    const { id } = params
    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
        return NextResponse.json({ error: "Missing title or content" }, { status: 400 })
    }

    // Fetch the post to verify the author
    const post = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: { author: true }
    })

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.author.email !== session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedPost = await prisma.post.update({
        where: { id: Number(id) },
        data: { title, content }
    })

    return NextResponse.json(updatedPost, { status: 200 })
}
