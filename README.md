# Aetheris AI 🌌

Aetheris AI is a next-generation, AI-driven global travel intelligence and planning system. It leverages advanced Large Language Model (LLM) reasoning agents to design day-by-day itineraries, track budgets, parse booking ticket confirmation emails or PDFs, and provide an interactive conversational companion for travelers.

---

## 🚀 Key Features

- **Conversational Travel Agent**: Interactive chat layout to query travel logistics, flight details, hotels, and tourist attractions.
- **Dynamic Itinerary Planning**: Generates detailed day-by-day travel plans, including activity slots, restaurants, and packing guides.
- **Smart Ticket Parser**: Automatically parses and extracts flight numbers, schedules, dates, and prices from receipts or tickets.
- **Visual Budget Tracker**: Aggregates expected vs. actual expenses and plots breakdown charts with Recharts.
- **Resilient Offline Fallbacks**: Automatically falls back to mock services and client-side storage during API outages to keep the UX smooth.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **State Management**: TanStack React Query (v5)
- **Styling**: Tailwind CSS (v4) with dark mode gradients & custom micro-animations
- **UI Components**: HeroUI / React & Lucide icons
- **Data Visualization**: Recharts
- **Networking**: Axios client with auto-fallback patterns

---

## 📂 Directory Structure

```filepath
Aetheris-AI/
├── app/                  # Next.js routes and pages
│   ├── about/            # Project info & architect details
│   ├── ai-hub/           # Active AI model preferences & configuration
│   ├── chat/             # Primary conversational travel assistant
│   ├── explore/          # Trip recommendation gallery
│   ├── items/            # Ticket addition and booking management
│   ├── trips/[id]/       # Dynamic single trip itinerary & analytics
│   ├── login/ /register/ # User session authentication UI
│   └── globals.css       # Core design system & theme values
├── components/           # Shared UI components (Navbar, Footer, DestinationCard, Loaders)
├── context/              # Global React Contexts (AuthContext)
├── lib/                  # Helper utilities, Axios clients, mock database fallbacks
└── package.json          # Project configurations and dependency graph
```

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18+ recommended) and `npm` installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Running the Development Server
Launch the local development workspace:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📡 API Integration & Backend
This frontend client communicates with the **Aetheris-AI-server** located in the sibling folder. Ensure the backend server is running on port `5000` to enable booking parser, live itineraries, and AI agent chat functions. If offline, the client will operate in mock-data mode automatically.
