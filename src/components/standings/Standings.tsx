export default function Standings({ table }: { table: any[] }) {
    if (!Array.isArray(table) || table.length === 0) {
      return <p>No standings available.</p>;
    }
  
    return (
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Position</th>
            <th className="text-left p-2">Team</th>
            <th className="text-left p-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {table.map((team) => (
            <tr key={team.team.id} className="border-b">
              <td className="p-2">{team.position}</td>
              <td className="p-2">{team.team.name}</td>
              <td className="p-2">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  