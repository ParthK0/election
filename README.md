# ElectIQ - Election Education App

An interactive civic education tool built with React and Gemini AI to help voters understand electoral processes, timelines, and rights.

## Tech Stack
- **Frontend**: React + Vite
- **AI**: Google Gemini 1.5 Flash
- **Styling**: Tailwind CSS + Framer Motion
- **Deployment**: Vercel

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
