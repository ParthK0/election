# ElectIQ - Election Education App

An interactive civic education tool built with React and Gemini AI to help voters understand electoral processes, timelines, and rights.

## Problem Statement
Civic education is often dry, confusing, and scattered across multiple government portals, leading to low voter turnout and engagement among younger demographics. ElectIQ solves this by consolidating electoral rules, timelines, and candidate data into an intuitive, highly accessible, and gamified experience. It translates complex legal jargon into plain language and provides step-by-step guidance tailored to the user's role (voter or candidate).

## Google Services Used
To provide a production-grade experience, ElectIQ deeply integrates with the Google Cloud and Firebase ecosystem:
1. **Google Gemini (Generative AI):** Powers the core conversational engine, providing context-aware answers to civic questions while maintaining strict neutrality rules.
2. **Firebase Analytics:** Tracks user engagement across different election phases and interactions to improve learning outcomes.
3. **Firebase Performance Monitoring:** Auto-tracks page load times and API latency to ensure the app remains responsive even during high-traffic election cycles.
4. **Firebase Firestore (Database):** Securely persists and syncs users' educational quiz scores, featuring offline persistence.
5. **Firebase Hosting:** Distributes the globally cached production Vite build.

## Tech Stack
- **Frontend**: React + Vite
- **AI**: Google Gemini 2.0 Flash
- **Styling**: Tailwind CSS + Framer Motion
- **Deployment**: Firebase Hosting / Vercel

## Architecture
- **Context Separation**: State is divided into `ElectionContext` (core metadata) and `ChatContext` (AI conversation streams) for better debugging and performance.
- **Role Asymmetry**: Data models are designed to show distinct procedures for Voters vs. Candidates.

## Scalability & Future Growth
> [!NOTE]
> Currently, ElectIQ uses static JSON files for electoral data. For a production-ready application, the next steps include:
> 1. **Headless CMS Integration**: Migrating data to Contentful or Sanity for non-technical editors.
> 2. **Global API**: Moving the data logic to a dedicated backend to support real-time election result scraping.
> 3. **Edge Chat**: Leveraging Vercel Edge Functions for lower-latency AI responses.

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your `GEMINI_API_KEY`
4. Run locally: `npm run dev`
