# ⚽ Fantasy Edge - Football Match Analytics & Fan Engagement Platform

Fantasy Edge is a full-stack football analytics platform that combines real-time data, fantasy football insights, and fan engagement features. Built with Next.js, it allows users to explore match statistics, standings, video highlights, and team details from the world's top football leagues — all in one interactive dashboard.

---

## 🚀 Features

- 🏟️ View **live and scheduled matches** with real-time data
- 📊 Browse **Premier League standings**
- 📺 Watch **video highlights** powered by Scorebat
- 📅 Explore matches across **multiple competitions** (EPL, La Liga, UCL, etc.)
- 👥 Dive into team data, top scorers, and upcoming fixtures
- 🔐 Authentication with **NextAuth.js** (login, signup, logout)
- 🎮 Future features: Fantasy team builder, player comparison tools, user polls

---

## 🧰 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Node.js API routes
- **Auth**: NextAuth.js (Credentials Provider)
- **Data Sources**:  
  - [Football-Data.org](https://www.football-data.org/) – match stats, teams, standings  
  - [Scorebat API](https://www.scorebat.com/video-api/) – video highlights
- **Deployment**: Vercel (CI/CD)

---

## 📂 Folder Structure

src/
├── app/
│ ├── dashboard/ # Main dashboard route
│ ├── login/ # Auth pages
│ └── api/footballData.ts # All API integration logic
├── components/
│ ├── navbar/ # Main navigation
│ ├── matchlist/ # Live & scheduled matches
│ ├── standings/ # League standings table
│ ├── highlights/ # Scorebat video highlights
│ └── competitionselector/ # Filter by league/competition

yaml
Copy
Edit
