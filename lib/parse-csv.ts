import type { Municipality } from "@/types/municipality"

export function parseCsv(csvData: string): Municipality[] {
  const lines = csvData.split("\n")
  const municipalities: Municipality[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Split by semicolon and extract code and name
    const parts = line.split(";")
    if (parts.length >= 2) {
      const code = parts[0].trim()
      const name = parts[1].trim()

      // Skip header row or invalid entries
      if (code !== "01" && !isNaN(Number(code))) {
        municipalities.push({
          code,
          name,
        })
      }
    }
  }

  return municipalities
}
