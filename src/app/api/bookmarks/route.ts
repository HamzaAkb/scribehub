import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postId } = await request.json()
    if (!postId) {
        return NextResponse.json({ error: "Missing postId" }, { status: 400 })
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    })
    if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    try {
        const bookmark = await prisma.bookmark.create({
            data: {
                userId: currentUser.id,
                postId: Number(postId),
            },
        })
        return NextResponse.json(bookmark, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Bookmark already exists" }, { status: 400 })
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postId } = await request.json()
    if (!postId) {
        return NextResponse.json({ error: "Missing postId" }, { status: 400 })
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    })
    if (!currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    try {
        await prisma.bookmark.delete({
            where: {
                userId_postId: {
                    userId: currentUser.id,
                    postId: Number(postId),
                },
            },
        })
        return NextResponse.json({ message: "Bookmark removed" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Bookmark not found" }, { status: 404 })
    }
}
