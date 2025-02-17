import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, tags } = body

    if (!title || !content) {
        return NextResponse.json({ error: 'Missing title or content' }, { status: 400 })
    }

    const tagNames = tags ? tags.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "") : []

    const post = await prisma.post.create({
        data: {
            title,
            content,
            published: false,
            author: {
                connect: { email: session.user.email }
            },
            tags: {
                connectOrCreate: tagNames.map((tagName: string) => ({
                    where: { name: tagName },
                    create: { name: tagName }
                }))
            }
        }
    })

    return NextResponse.json(post, { status: 201 })
}
