import React from "react";

interface LiveScoresProps {
  matches: any[]; // define types as you build
}

const LiveScores: React.FC<LiveScoresProps> = ({ matches }) => {
  console.log("LiveScores matches prop:", matches); // <-- Add this line

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Live Scores</h2>
      {matches.length === 0 ? (
        <p>No live matches right now.</p>
      ) : (
        matches.map((match) => (
          <div key={match.id} className="p-3 border rounded mb-3">
            <p>{match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}</p>
            <p>Status: {match.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default LiveScores;
