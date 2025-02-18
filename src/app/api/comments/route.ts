import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import nodemailer from "nodemailer"

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

    const comment = (await prisma.comment.create({
        data: {
            content,
            post: { connect: { id: Number(postId) } },
            author: { connect: { email: session.user.email } },
        },
        include: {
            author: true,
            post: { include: { author: true } },
        },
    })) as any

    if (comment.post.author.email !== session.user.email) {
        await prisma.notification.create({
            data: {
                userId: comment.post.author.id,
                type: "comment",
                message: `New comment on your post "${comment.post.title}": ${comment.content.substring(0, 100)}...`,
            },
        })

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        })

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: comment.post.author.email,
            subject: `New comment on your post "${comment.post.title}"`,
            text: `Hello,\n\nA new comment has been posted on your post "${comment.post.title}":\n\n"${comment.content}"\n\nView the comment in your dashboard.\n\nBest,\nScribe Hub Team`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email notification:", error)
            } else {
                console.log("Email notification sent:", info.response)
            }
        })
    }

    return NextResponse.json(comment, { status: 201 })
}
