// src/components/competitions/CompetitionList.tsx

import React from 'react'
import { Competition } from '@/lib/types/football'
interface CompetitionListProps {
  competitions: Competition[]
}

const CompetitionList: React.FC<CompetitionListProps> = ({ competitions }) => {
  if (!competitions || competitions.length === 0) {
    return <div className="text-gray-500">No competitions available for this area</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {competitions.map((competition) => (
        <div 
          key={competition.id} 
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-start gap-3">
            {competition.emblem && (
              <img 
                src={competition.emblem} 
                alt={`${competition.name} logo`} 
                className="h-8 w-8 object-contain"
              />
            )}
            <div className="flex-1">
              <h2 className="font-bold text-lg">{competition.name}</h2>
              <p className="text-gray-600">Code: {competition.code}</p>
              <p className="text-sm text-gray-500">Type: {competition.type}</p>
              {competition.currentSeason && (
                <div className="mt-2 text-sm">
                  <p className="text-green-600">
                    Season: {new Date(competition.currentSeason.startDate).getFullYear()} - {new Date(competition.currentSeason.endDate).getFullYear()}
                  </p>
                  {competition.currentSeason.currentMatchday && (
                    <p className="text-blue-600">
                      Matchday: {competition.currentSeason.currentMatchday}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CompetitionList