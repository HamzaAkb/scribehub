import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    const now = new Date()

    const updatedPosts = await prisma.post.updateMany({
        where: {
            scheduledAt: { lte: now },
            published: false,
        },
        data: { published: true },
    })

    return NextResponse.json({ message: `Published ${updatedPosts.count} posts` })
}
