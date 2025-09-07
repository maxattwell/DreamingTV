export const API_BASE_URL = 'https://www.dreamingspanish.com/.netlify/functions';

export const API_ENDPOINTS = {
  // Auth endpoints
  NEW_EPHEMERAL_ACCOUNT: '/newEphemeralAccount',
  REGISTER: '/register',
  VERIFY: '/verify',
  
  // User endpoints
  USER: '/user',
  DAY_WATCHED_TIME: '/dayWatchedTime',
  EXTERNAL_TIME: '/externalTime',
  
  // Video endpoints
  VIDEOS: '/videos',
  VIDEO: '/video',

    // Video endpoints
  SERIES: '/series',
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
