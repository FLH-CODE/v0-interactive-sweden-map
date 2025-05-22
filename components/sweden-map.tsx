"use client"

import { useEffect, useRef, useState } from "react"
import type { Municipality } from "@/types/municipality"
import MunicipalityPopup from "./municipality-popup"

interface SwedenMapProps {
  municipalities: Municipality[]
}

export default function SwedenMap({ municipalities }: SwedenMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [svgLoaded, setSvgLoaded] = useState(false)

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch("/api/svg")
        const svgText = await response.text()

        if (svgRef.current) {
          svgRef.current.innerHTML = svgText

          // Add event listeners to all municipality paths
          const paths = svgRef.current.querySelectorAll("polygon")
          paths.forEach((path) => {
            const municipalityId = path.id

            // Find the corresponding municipality data
            const municipality = municipalities.find((m) => m.code === municipalityId)

            if (municipality) {
              path.setAttribute("data-name", municipality.name)

              path.addEventListener("mouseenter", () => {
                path.classList.add("hover")
              })

              path.addEventListener("mouseleave", () => {
                if (selectedMunicipality?.code !== municipalityId) {
                  path.classList.remove("hover")
                }
              })

              path.addEventListener("click", (e) => {
                // Remove highlight from previously selected municipality
                if (selectedMunicipality) {
                  const prevPath = svgRef.current?.querySelector(`#${selectedMunicipality.code}`)
                  prevPath?.classList.remove("selected")
                }

                // Highlight the selected municipality
                path.classList.add("selected")

                // Set the selected municipality and popup position
                setSelectedMunicipality(municipality)

                const rect = path.getBoundingClientRect()
                const svgRect = svgRef.current?.getBoundingClientRect() || { left: 0, top: 0 }

                setPopupPosition({
                  x: rect.left + rect.width / 2 - svgRect.left,
                  y: rect.top + rect.height / 2 - svgRect.top,
                })
              })
            }
          })

          setSvgLoaded(true)
        }
      } catch (error) {
        console.error("Error loading SVG:", error)
      }
    }

    if (municipalities.length > 0) {
      loadSvg()
    }
  }, [municipalities])

  const closePopup = () => {
    try {
      if (selectedMunicipality && svgRef.current) {
        // Use a safer way to find the element by iterating through all polygons
        const polygons = svgRef.current.querySelectorAll("polygon")
        polygons.forEach((polygon) => {
          if (polygon.id === selectedMunicipality.code) {
            polygon.classList.remove("selected")
          }
        })

        setSelectedMunicipality(null)
      }
    } catch (error) {
      console.error("Error closing popup:", error)
      // Ensure state is reset even if there's an error
      setSelectedMunicipality(null)
    }
  }

  return (
    <div className="relative w-full">
      <div className="sweden-map-container border border-gray-300 rounded-lg p-4 bg-white">
        <svg ref={svgRef} className="w-full h-auto" viewBox="0 0 290 654" preserveAspectRatio="xMidYMid meet" />
      </div>

      {selectedMunicipality && (
        <MunicipalityPopup municipality={selectedMunicipality} position={popupPosition} onClose={closePopup} />
      )}

      <style jsx>{`
        :global(.sweden-map-container polygon) {
          fill: #e5e7eb;
          stroke: #374151;
          stroke-width: 0.3;
          transition: fill 0.2s ease;
        }
        
        :global(.sweden-map-container polygon.hover) {
          fill: #93c5fd;
          cursor: pointer;
        }
        
        :global(.sweden-map-container polygon.selected) {
          fill: #3b82f6;
        }
      `}</style>
    </div>
  )
}
