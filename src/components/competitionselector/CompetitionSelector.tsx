// src/components/competitionselector/CompetitionSelector.tsx

import { Suspense } from 'react'
// Import a function that actually exists - you'll need to check your @/lib/api file
// import { fetchCompetitionsByArea } from '@/lib/api'
import CompetitionList from '../competitionlist/CompetitionList'

interface CompetitionsPageProps {
  searchParams: {
    area?: string
    name?: string
  }
}

// Create the missing function or use an existing one
async function fetchCompetitionsByArea(areaId: number) {
  try {
    // Use your existing API route or function
    const response = await fetch(`/api/competitions?area=${areaId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch competitions');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching competitions by area:', error);
    return { competitions: [] };
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