import { createAuthClient } from "better-auth/react";

const isClient = typeof window !== 'undefined';
const isLocal = isClient && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
    (isLocal ? 'http://localhost:5000/api' : 'https://aetheris-ai-server.vercel.app/api');

// Extract base server URL by removing trailing "/api" if present
const baseURL = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

export const authClient = createAuthClient({
    baseURL: baseURL,
});
