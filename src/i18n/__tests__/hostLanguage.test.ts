import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import {hostLanguageDetector} from '../hostLanguage'
import {detectionOptions, SUPPORTED_LANGUAGES} from '../index'

// jsdom's window.location is unforgeable, so swap the whole location object.
function stubHostname(hostname: string) {
  vi.stubGlobal('location', {...window.location, hostname})
}

function stubNavigatorLanguage(language: string) {
  vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(language)
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue([language])
}

async function resolveLanguage(): Promise<string | undefined> {
  const detector = new LanguageDetector()
  detector.addDetector(hostLanguageDetector)
  const instance = i18next.createInstance()
  await instance.use(detector).init({
    resources: Object.fromEntries(SUPPORTED_LANGUAGES.map(l => [l, {translation: {probe: l}}])),
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    detection: detectionOptions,
  })
  return instance.resolvedLanguage
}

describe('hostLanguageDetector', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('host detector returns pl on rozaniec.motyl.dev', () => {
    stubHostname('rozaniec.motyl.dev')
    expect(hostLanguageDetector.lookup()).toBe('pl')
  })

  it('host detector returns undefined on rosary.motyl.dev', () => {
    stubHostname('rosary.motyl.dev')
    expect(hostLanguageDetector.lookup()).toBeUndefined()
  })

  it('host detector returns undefined on localhost', () => {
    stubHostname('localhost')
    expect(hostLanguageDetector.lookup()).toBeUndefined()
  })
})

describe('i18n detection config', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('detection order is localStorage, host, navigator', () => {
    expect(detectionOptions.order).toEqual(['localStorage', 'host', 'navigator'])
    expect(detectionOptions.caches).toEqual(['localStorage'])
    expect(detectionOptions.lookupLocalStorage).toBe('rosary-language')
  })

  it('saved language wins over the rozaniec host', async () => {
    stubHostname('rozaniec.motyl.dev')
    stubNavigatorLanguage('en-US')
    window.localStorage.setItem('rosary-language', 'en')
    expect(await resolveLanguage()).toBe('en')
  })

  it('rozaniec host resolves pl over an en-US navigator when nothing is saved', async () => {
    stubHostname('rozaniec.motyl.dev')
    stubNavigatorLanguage('en-US')
    expect(await resolveLanguage()).toBe('pl')
  })

  it('other hosts fall through to the navigator language', async () => {
    stubHostname('rosary.motyl.dev')
    stubNavigatorLanguage('en-US')
    expect(await resolveLanguage()).toBe('en')
  })
})
