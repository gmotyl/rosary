export const appConfig = {
  rosaryApiUrl: import.meta.env.VITE_ROSARY_API ?? '',
  googleRedirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI ?? '',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
}
