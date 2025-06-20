// src/app/dashboard/competitions/[id]/page.tsx
import { 
  getCompetitionDetails, 
  getCompetitionStandings,
  getCompetitionMatches,
  getCompetitionScorers,
  getCompetitionTeams, 
} from '@/app/api/footballdata';
import { notFound } from 'next/navigation';
import CompetitionHeader from './components/CompetitionHeader';
import CurrentSeasonCard from './components/CurrentSeasonCard';
import RecentSeasonsTable from './components/RecentSeasonsTable';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Define the Season type
interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday?: number;
  winner?: any;
}

export default async function CompetitionPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  
  const [competition, standings, matches, scorers, teams] = await Promise.all([
    getCompetitionDetails(id),
    getCompetitionStandings(id),
    getCompetitionMatches(id),
    getCompetitionScorers(id),
    getCompetitionTeams(id),
  ]);

  if (!competition) return notFound();

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

  // Get recent seasons (last 5 years) with proper typing
  const recentSeasons = seasons
    .slice(0, 5)
    .sort((a: Season, b: Season) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
  console.log(recentSeasons);

  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:pt-24">
      <CompetitionHeader {...{ name, code, emblem, area, type, flag }} />
      <CurrentSeasonCard
        currentSeason={currentSeason}
        lastUpdatedFormatted={formatDate(lastUpdated)}
      />
      <RecentSeasonsTable
        seasons={recentSeasons.map((season: Season) => ({
          ...season,
          startDateFormatted: formatDate(season.startDate),
          endDateFormatted: formatDate(season.endDate)
        }))}
      />
      
      {/* Add remaining components here */}
    </div>
  );
}