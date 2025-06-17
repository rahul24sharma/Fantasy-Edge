// src/app/dashboard/competitions/[id]/page.tsx
import { getCompetitionDetails, getCompetitionStandings,
    getCompetitionMatches,
    getCompetitionScorers,
    getCompetitionTeams, } from '@/app/api/footballdata';
import { notFound } from 'next/navigation';
import CompetitionHeader from './components/CompetitionHeader';
import CurrentSeasonCard from './components/CurrentSeasonCard';
import RecentSeasonsTable from './components/RecentSeasonsTable';
import { console } from 'inspector';

export default async function CompetitionPage({ params }: { params: { id: string } }) {
    const [competition, standings, matches, scorers, teams] = await Promise.all([
        getCompetitionDetails(params.id),
        getCompetitionStandings(params.id),
        getCompetitionMatches(params.id),
        getCompetitionScorers(params.id),
        getCompetitionTeams(params.id),
      ]);  if (!competition) return notFound();

  const { 
    name, 
    code, 
    emblem, 
    area, 
    currentSeason, 
    lastUpdated, 
    type,
    seasons,
    flag
  } = competition;

  console.log("Competition data:");
  Object.entries(competition).forEach(([key, value]) => {
    console.log(key, value);
  });

  // Format dates nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get recent seasons (last 5 years)
  const recentSeasons = seasons
    .slice(0, 5)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    console.log(recentSeasons)

  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:pt-24">
    <CompetitionHeader {...{ name, code, emblem, area, type, flag }} />
    <CurrentSeasonCard
  currentSeason={currentSeason}
  lastUpdatedFormatted={formatDate(lastUpdated)}
/>

<RecentSeasonsTable
  seasons={recentSeasons.map(season => ({
    ...season,
    startDateFormatted: formatDate(season.startDate),
    endDateFormatted: formatDate(season.endDate)
  }))}
/>

    {/* Add remaining components here */}
  </div>

  );
}