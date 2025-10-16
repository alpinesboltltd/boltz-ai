import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style elements
    $("script, style, nav, header, footer, aside").remove();

    // Extract text content
    let content = "";

    // Get title
    const title = $("title").text().trim();
    if (title) {
      content += `Title: ${title}\n\n`;
    }

    // Get main content areas
    const contentSelectors = [
      "main",
      "article",
      ".content",
      "#content",
      ".post-content",
      ".entry-content",
      "p",
      "h1, h2, h3, h4, h5, h6",
      "li",
    ];

    contentSelectors.forEach((selector) => {
      $(selector).each((_, element) => {
        const text = $(element).text().trim();
        if (text && text.length > 20) {
          content += text + "\n";
        }
      });
    });

    // Clean up the content
    content = content
      .replace(/\n\s*\n/g, "\n\n") // Remove extra whitespace
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    console.log(content, "CONTENTS");
    if (!content) {
      throw new Error("No content could be extracted from the webpage");
    }

    return NextResponse.json({
      content,
      title,
      url,
      success: true,
    });
  } catch (error) {
    console.error("Error crawling website:", error);
    return NextResponse.json(
      { error: "Failed to crawl website" },
      { status: 500 }
    );
  }
}
