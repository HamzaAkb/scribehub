import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: { author: true },
        take: 20,
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const rssItems = posts
        .map((post) => {
            return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${siteUrl}/posts/${post.id}</link>
        <guid>${siteUrl}/posts/${post.id}</guid>
        <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
        <description><![CDATA[${post.content.substring(0, 200)}]]></description>
      </item>
      `
        })
        .join("")

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Scribe Hub Blog</title>
      <link>${siteUrl}</link>
      <description>Scribe Hub - A Multi-User Blogging Platform</description>
      ${rssItems}
    </channel>
  </rss>`

    return new NextResponse(rss, {
        headers: { "Content-Type": "application/rss+xml" },
    })
}
