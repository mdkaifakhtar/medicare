import mockApi from './mockApi.js';
import { apiClient } from './apiClient.js';

// Single data-layer entry point.
// VITE_USE_MOCK_API=false points the whole app at the Express/MongoDB backend
// through axios (services/apiClient.js). Left on by default so the UI behaves
// exactly as before when no backend is running.
const useMock = String(import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false';

const api = useMock ? mockApi : apiClient;

export { mockApi, apiClient, useMock };
export default api;
