// app/competitions/page.tsx

import { Suspense } from 'react'
import { fetchCompetitionsByArea } from '@/lib/api'
import CompetitionList from '../competitionlist/CompetitionList'

interface CompetitionsPageProps {
  searchParams: {
    area?: string
    name?: string
  }
}

const CompetitionsPage = async ({ searchParams }: CompetitionsPageProps) => {
  const areaId = searchParams.area ? parseInt(searchParams.area) : null
  const areaName = searchParams.name || 'Unknown Area'

  if (!areaId) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Competitions</h1>
        <p className="text-red-500">No area selected</p>
      </div>
    )
  }

  const data = await fetchCompetitionsByArea(areaId)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Competitions in {areaName}</h1>
      <Suspense fallback={<div>Loading competitions...</div>}>
        <CompetitionList competitions={data.competitions} />
      </Suspense>
    </div>
  )
}

export default CompetitionsPage