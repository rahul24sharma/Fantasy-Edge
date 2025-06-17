export async function getVideoHighlights() {
    const res = await fetch("https://www.scorebat.com/video-api/v3/", {
      next: { revalidate: 3600 },
    });
  
    if (!res.ok) throw new Error("Failed to fetch highlights");
    const data = await res.json();
    return data.response;
  }
  