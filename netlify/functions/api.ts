import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    const path = event.path || ''
    const endsWith = (suffix: string) => path.endsWith(suffix)

    // Support both "/api/*" (via redirects) and "/.netlify/functions/api/*" direct calls
    if (endsWith('/health')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        }),
      }
    }

    if (endsWith('/status')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          service: 'Infinity Predictive API',
          version: '1.0.0',
          status: 'operational',
          timestamp: new Date().toISOString(),
        }),
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: 'Not Found',
        message: 'API endpoint not found',
      }),
    }
  } catch (error) {
    console.error('API Error:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      }),
    }
  }
}
