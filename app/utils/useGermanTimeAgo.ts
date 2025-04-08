import type { MaybeRefOrGetter, Pausable } from "@vueuse/shared"
import type { ComputedRef } from "vue-demi"
import { toValue } from "@vueuse/shared"
import { computed } from "vue-demi"

export type ZeitFormattierer<T = number> = (value: T, istVergangen: boolean) => string

export type ZeitEinheitenStandard = "sekunde" | "minute" | "stunde" | "tag" | "woche" | "monat" | "jahr"

export interface ZeitNachrichtenEingebaut {
  gerade: string
  vergangen: string | ZeitFormattierer<string>
  zukunft: string | ZeitFormattierer<string>
  ungueltig: string
}

export type ZeitNachrichten<EinheitNamen extends string = ZeitEinheitenStandard> = ZeitNachrichtenEingebaut &
  Record<EinheitNamen, string | ZeitFormattierer<number>>

export interface ZeitFormatierungsOptionen<EinheitNamen extends string = ZeitEinheitenStandard> {
  /**
   * Maximale Einheit (in Millisekunden) ab der das vollständige Datum anstelle der relativen Zeit angezeigt wird
   *
   * @default undefined
   */
  max?: EinheitNamen | number

  /**
   * Formatierer für vollständiges Datum
   */
  vollDatumFormatierer?: (datum: Date) => string

  /**
   * Nachrichten für die Formatierung
   */
  nachrichten?: ZeitNachrichten<EinheitNamen>

  /**
   * Minimale Anzeigeeinheit (Standard ist Minute)
   *
   * @default false
   */
  zeigeSeconden?: boolean

  /**
   * Rundungsmethode
   *
   * @default 'round'
   */
  rundung?: "round" | "ceil" | "floor" | number

  /**
   * Benutzerdefinierte Einheiten
   */
  einheiten?: ZeitEinheit<EinheitNamen>[]
}

export interface ZeitOptionen<Steuerung extends boolean, EinheitNamen extends string = ZeitEinheitenStandard> extends ZeitFormatierungsOptionen<EinheitNamen> {
  /**
   * Weitere Steuerungsmöglichkeiten
   *
   * @default false
   */
  steuerung?: Steuerung

  /**
   * Aktualisierungsintervall, 0 für keine automatische Aktualisierung
   *
   * @default 30_000
   */
  aktualisierungsIntervall?: number
}

export interface ZeitEinheit<Einheit extends string = ZeitEinheitenStandard> {
  max: number
  wert: number
  name: Einheit
}

const STANDARD_EINHEITEN: ZeitEinheit<ZeitEinheitenStandard>[] = [
  { max: 60000, wert: 1000, name: "sekunde" },
  { max: 2760000, wert: 60000, name: "minute" },
  { max: 72000000, wert: 3600000, name: "stunde" },
  { max: 518400000, wert: 86400000, name: "tag" },
  { max: 2419200000, wert: 604800000, name: "woche" },
  { max: 28512000000, wert: 2592000000, name: "monat" },
  { max: Number.POSITIVE_INFINITY, wert: 31536000000, name: "jahr" }
]

const STANDARD_NACHRICHTEN: ZeitNachrichten<ZeitEinheitenStandard> = {
  gerade: "gerade eben",
  vergangen: (n) => (n.match(/\d/) ? `vor ${n}` : n),
  zukunft: (n) => (n.match(/\d/) ? `in ${n}` : n),
  monat: (n, vergangen) => (n === 1 ? (vergangen ? "letzten Monat" : "nächsten Monat") : `${n} Monat${n > 1 ? "e" : ""}`),
  jahr: (n, vergangen) => (n === 1 ? (vergangen ? "letztes Jahr" : "nächstes Jahr") : `${n} Jahr${n > 1 ? "e" : ""}`),
  tag: (n, vergangen) => (n === 1 ? (vergangen ? "gestern" : "morgen") : `${n} Tag${n > 1 ? "e" : ""}`),
  woche: (n, vergangen) => (n === 1 ? (vergangen ? "letzte Woche" : "nächste Woche") : `${n} Woche${n > 1 ? "n" : ""}`),
  stunde: (n) => `${n} Stunde${n > 1 ? "n" : ""}`,
  minute: (n) => `${n} Minute${n > 1 ? "n" : ""}`,
  sekunde: (n) => `${n} Sekunde${n > 1 ? "n" : ""}`,
  ungueltig: ""
}

function STANDARD_FORMATIERER(datum: Date) {
  return datum.toISOString().slice(0, 10)
}

export type ZeitRueckgabe<Steuerung extends boolean = false> = Steuerung extends true ? { zeitVergangen: ComputedRef<string> } & Pausable : ComputedRef<string>

/**
 * Reaktiver Zeitformatierer.
 *
 * @see https://vueuse.org/useTimeAgo
 */
export function nutzeZeitVergangen<EinheitNamen extends string = ZeitEinheitenStandard>(
  zeit: MaybeRefOrGetter<Date | number | string>,
  optionen?: ZeitOptionen<false, EinheitNamen>
): ZeitRueckgabe<false>
export function nutzeZeitVergangen<EinheitNamen extends string = ZeitEinheitenStandard>(
  zeit: MaybeRefOrGetter<Date | number | string>,
  optionen: ZeitOptionen<true, EinheitNamen>
): ZeitRueckgabe<true>
export function nutzeZeitVergangen<EinheitNamen extends string = ZeitEinheitenStandard>(
  zeit: MaybeRefOrGetter<Date | number | string>,
  optionen: ZeitOptionen<boolean, EinheitNamen> = {}
) {
  const { steuerung: zeigeSteuerung = false, aktualisierungsIntervall = 30_000 } = optionen

  const { now: jetzt, ...steuerung } = useNow({ interval: aktualisierungsIntervall, controls: true })
  const zeitVergangen = computed(() => formattiereZeitVergangen(new Date(toValue(zeit)), optionen, toValue(jetzt)))

  if (zeigeSteuerung) {
    return {
      zeitVergangen,
      ...steuerung
    }
  } else {
    return zeitVergangen
  }
}

export function formattiereZeitVergangen<EinheitNamen extends string = ZeitEinheitenStandard>(
  von: Date,
  optionen: ZeitFormatierungsOptionen<EinheitNamen> = {},
  jetzt: Date | number = Date.now()
): string {
  const {
    max,
    nachrichten = STANDARD_NACHRICHTEN as ZeitNachrichten<EinheitNamen>,
    vollDatumFormatierer = STANDARD_FORMATIERER,
    einheiten = STANDARD_EINHEITEN as ZeitEinheit<EinheitNamen>[],
    zeigeSeconden = false,
    rundung = "round"
  } = optionen

  const rundeFn = typeof rundung === "number" ? (n: number) => +n.toFixed(rundung) : Math[rundung]

  const diff = +jetzt - +von
  const absDiff = Math.abs(diff)

  function getWert(diff: number, einheit: ZeitEinheit<EinheitNamen>) {
    return rundeFn(Math.abs(diff) / einheit.wert)
  }

  function formatiere(diff: number, einheit: ZeitEinheit<EinheitNamen>) {
    const wert = getWert(diff, einheit)
    const vergangen = diff > 0

    const str = wenderFormatAn(einheit.name as EinheitNamen, wert, vergangen)
    return wenderFormatAn(vergangen ? "vergangen" : "zukunft", str, vergangen)
  }

  function wenderFormatAn(name: EinheitNamen | keyof ZeitNachrichtenEingebaut, wert: number | string, istVergangen: boolean) {
    const formatierer = nachrichten[name]
    if (typeof formatierer === "function") return formatierer(wert as never, istVergangen)
    return formatierer.replace("{0}", wert.toString())
  }

  if (absDiff < 60000 && !zeigeSeconden) return nachrichten.gerade

  if (typeof max === "number" && absDiff > max) return vollDatumFormatierer(new Date(von))

  if (typeof max === "string") {
    const einheitMax = einheiten.find((i) => i.name === max)?.max
    if (einheitMax && absDiff > einheitMax) return vollDatumFormatierer(new Date(von))
  }

  for (const [idx, einheit] of einheiten.entries()) {
    const wert = getWert(diff, einheit)
    if (wert <= 0 && einheiten[idx - 1]) return formatiere(diff, einheiten[idx - 1])
    if (absDiff < einheit.max) return formatiere(diff, einheit)
  }

  return nachrichten.ungueltig
}
