// Custom i18next-browser-languagedetector detector: the rozaniec.* host
// serves the Polish audience, so it defaults to Polish when nothing is saved.
export const hostLanguageDetector = {
  name: 'host' as const,
  lookup(): string | undefined {
    return window.location.hostname.startsWith('rozaniec.') ? 'pl' : undefined
  },
}
