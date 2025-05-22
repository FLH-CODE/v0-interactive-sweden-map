import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://blobs.vusercontent.net/blob/SWE-Map_Kommuner2007-3yABuNzKLmz0LMrNnM6IuZNPK7rCtU.svg",
    )
    const svgText = await response.text()

    // Return the SVG content
    return new NextResponse(svgText, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    })
  } catch (error) {
    console.error("Error fetching SVG:", error)
    return new NextResponse("Error fetching SVG", { status: 500 })
  }
}
