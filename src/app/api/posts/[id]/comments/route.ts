import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const comments = await prisma.comment.findMany({
        where: { postId: Number(params.id) },
        include: { author: true },
        orderBy: { id: "asc" }
    })
    return NextResponse.json(comments)
}
