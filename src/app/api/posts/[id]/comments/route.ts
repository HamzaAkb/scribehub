import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    const comments = await prisma.comment.findMany({
        where: { postId: Number(id) },
        include: { author: true },
        orderBy: { id: "asc" }
    })

    return NextResponse.json(comments)
}
