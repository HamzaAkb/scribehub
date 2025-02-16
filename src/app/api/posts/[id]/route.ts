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
    const { title, content, published } = body

    if (!title || !content) {
        return NextResponse.json({ error: "Missing title or content" }, { status: 400 })
    }

    // Fetch the post to verify ownership
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
        data: { title, content, published: published === undefined ? post.published : published }
    })

    return NextResponse.json(updatedPost, { status: 200 })
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Fetch the post to verify ownership
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

    await prisma.post.delete({
        where: { id: Number(id) }
    })

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 })
}
