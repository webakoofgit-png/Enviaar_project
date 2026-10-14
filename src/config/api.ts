// Centralized API configuration for ENVIAAR
// In local dev, falls back to http://localhost:5000
// In production on the same domain (enviaar.com), uses relative path "" so requests go to /api/...

export const API_BASE_URL: string = 
  import.meta.env["VITE_API_URL"] !== undefined
    ? (import.meta.env["VITE_API_URL"] as string)
    : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? '' 
        : 'http://localhost:5000');
