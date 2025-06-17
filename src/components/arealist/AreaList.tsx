// src/components/arealist/AreaList.tsx

import React from 'react'
// import { Area } from '@/types/football'
import { Area } from '@/lib/types/football'

interface AreaListProps {
  areas: Area[]
  onAreaClick: (area: Area) => void
}

const AreaList: React.FC<AreaListProps> = ({ areas, onAreaClick }) => {
  if (!areas || areas.length === 0) {
    console.log(areas)
    return <div className="text-gray-500">No areas available</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {areas.map((area) => (
        <div 
          key={area.id} 
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          onClick={() => onAreaClick(area)}
        >
          <h2 className="font-bold text-lg">{area.name}</h2>
          {/* Fixed: Only show if countryCode exists */}
          {(area as any).countryCode && (
            <p className="text-gray-600">Country: {(area as any).countryCode}</p>
          )}
          {area.parentArea && (
            <p className="text-sm text-gray-500 mt-1">Parent region: {area.parentArea}</p>
          )}
          {area.flag && (
            <img 
              src={area.flag} 
              alt={`Flag of ${area.name}`} 
              className="h-5 mt-2" 
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default AreaList