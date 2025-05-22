"use client"

import type { Municipality } from "@/types/municipality"
import { X } from "lucide-react"

interface MunicipalityPopupProps {
  municipality: Municipality
  position: { x: number; y: number }
  onClose: () => void
}

export default function MunicipalityPopup({ municipality, position, onClose }: MunicipalityPopupProps) {
  return (
    <div
      className="absolute bg-white rounded-lg shadow-lg p-4 z-10 transform -translate-x-1/2 -translate-y-1/2 border border-gray-200 min-w-[200px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{municipality.name}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close popup">
          <X size={18} />
        </button>
      </div>
      <div className="text-sm text-gray-600">
        <p>Municipality Code: {municipality.code}</p>
      </div>
    </div>
  )
}
