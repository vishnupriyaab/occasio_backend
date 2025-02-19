export enum HttpStatusCode {
  // 2xx Success
  OK = 200,                    // Request succeeded
  CREATED = 201,               // Resource created successfully
  ACCEPTED = 202,              // Request accepted but not yet completed
  NO_CONTENT = 204,            // Request succeeded but no content returned
  
  // 3xx Redirection
  MOVED_PERMANENTLY = 301,     // Resource moved permanently
  FOUND = 302,                 // Resource found at different URL
  NOT_MODIFIED = 304,          // Resource not modified since last request
  
  // 4xx Client Errors
  BAD_REQUEST = 400,           // Invalid request format or parameters
  UNAUTHORIZED = 401,          // Authentication required
  FORBIDDEN = 403,             // Client lacks necessary permissions
  NOT_FOUND = 404,            // Requested resource not found
  METHOD_NOT_ALLOWED = 405,    // HTTP method not allowed for resource
  CONFLICT = 409,              // Request conflicts with current state
  UNPROCESSABLE_ENTITY = 422,  // Valid request but semantic errors
  TOO_MANY_REQUESTS = 429,     // Rate limit exceeded
  
  // 5xx Server Errors
  INTERNAL_SERVER_ERROR = 500, // Unexpected server error
  NOT_IMPLEMENTED = 501,       // Requested functionality not implemented
  BAD_GATEWAY = 502,           // Invalid response from upstream server
  SERVICE_UNAVAILABLE = 503,   // Server temporarily unavailable
  GATEWAY_TIMEOUT = 504        // Upstream server timeout
}