import env from '#start/env'
import { getLegalFormLabel } from '#utils/legal_form'
import { LogoService } from './logo.service.js'

interface LegalUnitPeriod {
  dateFin: string | null
  denominationUniteLegale?: string
  nomUniteLegale?: string
  nicSiegeUniteLegale: string
  activitePrincipaleUniteLegale: string
  categorieJuridiqueUniteLegale: number
}

interface LegalUnit {
  siren: string
  prenom1UniteLegale?: string
  periodesUniteLegale?: LegalUnitPeriod[]
  dateCreationUniteLegale: string
}

interface Address {
  numeroVoieEtablissement?: string
  libelleVoieEtablissement?: string
  codePostalEtablissement: string
  libelleCommuneEtablissement: string
}

interface Establishment {
  siret: string
  adresseEtablissement: Address
}

interface Logo {
  name: string
  logo_url: string
}

interface EnrichedCustomer {
  name: string
  siren: string
  siret: string
  naf: string
  legalFormCode: number
  legalFormName: string
  createdAt: string
  logoUrl?: string
  address: string
}

export class SireneService {
  private static readonly BASE_URL = 'https://api.insee.fr/api-sirene/3.11'
  private static readonly HEADERS = {
    'Accept': 'application/json',
    'X-INSEE-Api-Key-Integration': env.get('API_SIRENE_TOKEN', ''),
  }

  /**
   * Récupère les données d'une unité légale à partir d'un SIREN
   */
  public static async getLegalUnit(siren: string): Promise<LegalUnit> {
    const url = `${this.BASE_URL}/siren/${siren}`

    try {
      const response = await fetch(url, {
        headers: this.HEADERS,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch legal unit: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as { uniteLegale: LegalUnit }
      return data.uniteLegale
    } catch (error) {
      throw new Error(
        `Error fetching legal unit with SIREN ${siren}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Récupère les données d'un établissement à partir d'un SIRET
   */
  public static async getEstablishment(siret: string): Promise<Establishment> {
    const url = `${this.BASE_URL}/siret/${siret}`

    try {
      const response = await fetch(url, {
        headers: this.HEADERS,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch establishment: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as { etablissement: Establishment }
      return data.etablissement
    } catch (error) {
      throw new Error(
        `Error fetching establishment with SIRET ${siret}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Enrichit les données d'un client à partir de son SIREN
   */
  public static async enrichCustomer(siren: string): Promise<EnrichedCustomer> {
    try {
      const legalUnit = await this.getLegalUnit(siren)

      const currentPeriod = this.getCurrentPeriod(legalUnit)
      const name = this.formatName(legalUnit, currentPeriod)
      const siret = siren + currentPeriod.nicSiegeUniteLegale

      const establishment = await this.getEstablishment(siret)
      const logoUrl = await this.findLogoUrl(name)

      return {
        name,
        siren: legalUnit.siren,
        siret: establishment.siret,
        naf: currentPeriod.activitePrincipaleUniteLegale,
        legalFormCode: currentPeriod.categorieJuridiqueUniteLegale,
        legalFormName: getLegalFormLabel(currentPeriod.categorieJuridiqueUniteLegale),
        createdAt: legalUnit.dateCreationUniteLegale,
        logoUrl,
        address: this.formatAddress(establishment.adresseEtablissement),
      }
    } catch (error) {
      throw new Error(
        `Error enriching customer with SIREN ${siren}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Récupère la période courante d'une unité légale
   */
  private static getCurrentPeriod(legalUnit: LegalUnit): LegalUnitPeriod {
    const period = legalUnit.periodesUniteLegale?.find((p: LegalUnitPeriod) => p.dateFin === null)
    if (!period) {
      throw new Error(`No current period found for legal unit ${legalUnit.siren}`)
    }
    return period
  }

  /**
   * Formate le nom d'une unité légale
   */
  private static formatName(legalUnit: LegalUnit, period: LegalUnitPeriod): string {
    return (
      period.denominationUniteLegale ??
      `${legalUnit.prenom1UniteLegale ?? ''} ${period.nomUniteLegale ?? ''}`.trim()
    )
  }

  /**
   * Recherche et trouve l'URL du logo d'une entreprise
   */
  private static async findLogoUrl(name: string): Promise<string | undefined> {
    const logos = await LogoService.search(name)
    if (logos.length) {
      const matchingLogo = logos.find((l: Logo) => l?.name.toLowerCase() === name.toLowerCase())
      return matchingLogo?.logo_url
    } else return undefined
  }

  /**
   * Formate l'adresse d'un établissement
   */
  private static formatAddress(address: Address): string {
    return `${address.numeroVoieEtablissement ?? ''} ${address.libelleVoieEtablissement ?? ''}, ${address.codePostalEtablissement} ${address.libelleCommuneEtablissement}`.trim()
  }
}
