This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Aetheris AI

**Aetheris AI** is a next-generation travel intelligence and planning system. It leverages AI agents to simplify travel planning, itinerary creation, and ticket parsing.


## Features
- **AI Travel Assistant**: Chat with intelligent agents to plan your trips.
- **Smart Itineraries**: Generate detailed day-by-day itineraries dynamically.
- **Ticket Parsing**: Automatically extract travel schedules and details from ticket PDFs.
- **Budget Analysis**: Track and optimize expenses automatically.


## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: HeroUI / React
- **State Management**: TanStack React Query
- **Icons**: Lucide React & Gravity UI Icons
- **Charts**: Recharts


## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and configure environment variables.
4. Start the dev server using `npm run dev`.


## Project Structure
- `app/`: Contains Next.js routes and pages.
- `components/`: Reusable React components (Navbar, Footer, cards, etc.).
- `context/`: Context providers for authentication and application state.
- `lib/`: Helper utilities, API clients, and network configurations.


## App Routing Structure
- `/about`: Information about Aetheris AI.
- `/ai-hub`: Model configuration and options.
- `/chat`: Conversational AI planning chat.
- `/explore`: Browse destination cards and popular itineraries.
- `/items/add`: Manually log a booking confirmation.
- `/items/manage`: View and edit booked trips/tickets.
- `/login`: User sign-in interface.
- `/register`: User registration interface.
- `/trips/[id]`: Detailed layout for specific planned trips.


## Layout and Navigation
The main page layout includes a global `Navbar` and `Footer` that wrap the application workspace, providing responsive routing for mobile and desktop screens.


## Authentication (`context/AuthContext.tsx`)
Provides global access to the authenticated user's state, login/register helper methods, and session synchronization with localStorage.


## Network API Client (`lib/api.ts`)
Uses Axios to route request payloads to the Aetheris-AI-server backend. Implements connection retries and mock fallbacks in case of network failures.


## AI Chatbot Capabilities
Powered by LLM reasoning agents, the chat module parses complex natural language travel requests and suggests flight routes, hotels, and tourist attractions.


## Itinerary Generator
Automatically translates chat discussions into structured itineraries complete with schedules, locations, and descriptions, displayed beautifully in the trips layout.


## Budget Tracker
Calculates estimated vs. actual expenses using data parsed from travel tickets and user inputs, displaying visual charts via Recharts.


## Booking Parser Agent
Parses receipt emails, boarding passes, and booking confirmations using text recognition and extracts metadata key-value pairs (dates, flight numbers, costs).


## Environment Variables Template
Add the following variables to your `.env` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```


## React Query Integration
Utilizes React Query (`QueryProvider`) for caching client API responses, handling background query revalidation, and loading states for optimal UX.


## CSS & Design System
Built using Tailwind CSS with customized colors and animations to deliver a premium, modern dark mode workspace experience.
