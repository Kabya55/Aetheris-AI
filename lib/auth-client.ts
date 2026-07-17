import { createAuthClient } from "better-auth/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// Extract base server URL by removing trailing "/api" if present
const baseURL = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

export const authClient = createAuthClient({
  baseURL: baseURL,
});
