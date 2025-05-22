"use client"

import { useEffect, useState } from "react"
import SwedenMap from "@/components/sweden-map"
import type { Municipality } from "@/types/municipality"
import { parseCsv } from "@/lib/parse-csv"

export default function Home() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kommunkoder-U2SyrYwAdDsFjyVRd0zoWiXexBkl8j.csv",
        )
        const csvData = await response.text()
        const parsedData = parseCsv(csvData)
        setMunicipalities(parsedData)
      } catch (error) {
        console.error("Error loading municipality data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Interactive Sweden Municipality Map</h1>
      <div className="w-full max-w-4xl">
        <SwedenMap municipalities={municipalities} />
      </div>
    </main>
  )
}
