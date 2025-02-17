import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, tags, imageUrl, scheduledAt } = await request.json()

    const tagNames = tags
        ? tags.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "")
        : []

    let shouldPublish = true
    if (scheduledAt) {
        const scheduledDate = new Date(scheduledAt)
        shouldPublish = scheduledDate <= new Date()
    }

    const post = await prisma.post.create({
        data: {
            title,
            content,
            published: shouldPublish,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            imageUrl,
            author: { connect: { email: session.user.email } },
            tags: {
                connectOrCreate: tagNames.map((tagName: string) => ({
                    where: { name: tagName },
                    create: { name: tagName },
                })),
            },
        },
    })

    return NextResponse.json(post, { status: 201 })
}
