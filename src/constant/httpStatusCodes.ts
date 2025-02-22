export enum HttpStatusCode {
  OK = 200,                    // Request succeeded
  CREATED = 201,               // Resource created successfully
  BAD_REQUEST = 400,           // Invalid request format or parameters
  UNAUTHORIZED = 401,          // Authentication required
  FORBIDDEN = 403,             // Client lacks necessary permissions
  NOT_FOUND = 404,             // Requested resource not found
  CONFLICT = 409,              // Request conflicts with current state
  CLIENT_CLOSED_REQUEST = 499, // Non-standard: Client closed the connection before receiving a response (Nginx)
  INTERNAL_SERVER_ERROR = 500, // Unexpected server error
  BAD_GATEWAY = 502,           // Invalid response from upstream server
}