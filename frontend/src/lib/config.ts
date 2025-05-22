export const config = {
  isDevelopment: import.meta.env.DEV,
  bypassAuth: import.meta.env.DEV,  // Only true in development
  devUser: {
    name: 'Dev User',
    email: 'dev@example.com',
    token: 'dev-token'
  }
}; 