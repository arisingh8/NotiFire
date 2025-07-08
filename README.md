# NotiFire 🔥

### AI-Powered Intelligent Notification System

## Overview

**NotiFire** is an 3-way dashboard system designed to streamline the connection between residents at risk, dispatchers, and first responders at time of a crisis like a wildfire.

## Features

✅ **Smart Connection & Filtering** – Role-based sign-up:

- Allows residents to provide information about themselves and property.
- Allows dispatchers to locate nearby first responder units to dispatch them on command in relation to distance of the crisis
- Allows first responders to recieve accurate AI summaries regarding residents, reducing the time it takes them to assess a crisis situation.

✅ **Real-Time Data** – Integrates NASA FIRMS satellite data, updated via Vercel Cron Jobs
✅ **Real-Time Insights** – Provides analytics on notification engagement and effectiveness.  
✅ **Seamless Integrations** – Easily integrates with third-party services via APIs.

## Tech Stack

- **Frontend/Backend:** Next.js (Full-stack)
- **AI/ML:** Gemini 2.5 Flash for Real-time AI Summaries Based on database
- **Database:** Supabase

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js 18+
- npm or pnpm
- Supabase

### Setup

1. **Clone the repository**

   ```sh
   git clone https://github.com/tarantechnology/notifire.git
   cd notifire
   ```

2. **Install dependencies**

   ```sh
   pnpm install
   ```

3. **Set up environment variables**  
   Create a `.env.local` file in the root directory and configure:

   ```
   FIRE_RETENTION_DAYS="3"
   GEMINI_API_KEY=your_gemini_api_key
   MAP_KEY=your_nasa_firms_map_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the application**

   ```sh
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## Contact

For inquiries or collaboration, reach out at tpuvvala@gatech.edu, ari.singh@duke.edu, sli967@gatech.edu, or pingale3@gatech.ede.

🚀 **Stay notified, stay ahead with NotiFire!** 🔥
