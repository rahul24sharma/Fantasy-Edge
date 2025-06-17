const BASE_URL = process.env.FOOTBALL_API_BASE_URL! || "https://api.football-data.org/v4";
const API_KEY = "8bba67bee162456589814afddce138db";

export class FootballApiClient {
  // Fixed: Allow undefined values in params
  private async makeRequest<T>(endpoint: string, params?: Record<string, string | undefined>): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value); // This already handles undefined
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-Auth-Token': API_KEY,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Competition methods
  async getCompetitions(areas?: string) {
    return this.makeRequest('/competitions/', areas ? { areas } : undefined);
  }

  async getCompetition(id: string) {
    return this.makeRequest(`/competitions/${id}`);
  }

  async getCompetitionStandings(id: string, filters?: { matchday?: string; season?: string; date?: string }) {
    return this.makeRequest(`/competitions/${id}/standings`, filters);
  }

  async getCompetitionMatches(id: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    stage?: string;
    status?: string;
    matchday?: string;
    season?: string;
  }) {
    return this.makeRequest(`/competitions/${id}/matches`, filters);
  }

  async getCompetitionTeams(id: string, season?: string) {
    return this.makeRequest(`/competitions/${id}/teams`, season ? { season } : undefined);
  }

  async getCompetitionScorers(id: string, filters?: { limit?: string; season?: string }) {
    return this.makeRequest(`/competitions/${id}/scorers`, filters);
  }

  // Team methods
  async getTeam(id: string) {
    return this.makeRequest(`/teams/${id}`);
  }

  // Fixed: Filter out undefined values before passing to makeRequest
  async getTeams(limit?: string, offset?: string) {
    const params: Record<string, string> = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    
    return this.makeRequest('/teams/', Object.keys(params).length > 0 ? params : undefined);
  }

  async getMatches(filters?: {
    competitions?: string;
    ids?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
  }) {
    // Add default dateTo for scheduled matches
    if (filters?.status === 'SCHEDULED' && filters?.dateFrom && !filters.dateTo) {
      const dateFrom = new Date(filters.dateFrom);
      dateFrom.setDate(dateFrom.getDate() + 7); // Default to 7 days range
      filters.dateTo = dateFrom.toISOString().split('T')[0];
    }
    
    return this.makeRequest('/matches', filters);
  }

  // Match methods
  async getMatch(id: string) {
    return this.makeRequest(`/matches/${id}`);
  }

  async getMatchHead2Head(id: string, filters?: {
    limit?: string;
    dateFrom?: string;
    dateTo?: string;
    competitions?: string;
  }) {
    return this.makeRequest(`/matches/${id}/head2head`, filters);
  }

  // Person methods
  async getPerson(id: string) {
    return this.makeRequest(`/persons/${id}`);
  }

  async getPersonMatches(id: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    competitions?: string;
    limit?: string;
    offset?: string;
  }) {
    return this.makeRequest(`/persons/${id}/matches`, filters);
  }

  // Area methods
  async getAreas() {
    return this.makeRequest('/areas/');
  }

  async getArea(id: string) {
    return this.makeRequest(`/areas/${id}`);
  }

  async getCompetitionDetails(id: string) {
    return this.makeRequest(`/competitions/${id}`);
  }
}

export const footballApi = new FootballApiClient();