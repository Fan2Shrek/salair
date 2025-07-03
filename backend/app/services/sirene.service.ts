import env from '#start/env'
import { getLegalFormLabel } from '#utils/legal_form'

export class SireneService {
  private static readonly BASE_URL = 'https://api.insee.fr/api-sirene/3.11'
  private static readonly HEADERS = {
    'Accept': 'application/json',
    'X-INSEE-Api-Key-Integration': env.get('API_SIRENE_TOKEN', ''),
  }

  static async getLegalUnit(siren: string) {
    const url = `${this.BASE_URL}/siren/${siren}`
    const response = await fetch(url, {
      headers: this.HEADERS,
    })

    const data: any = await response.json()

    return data.uniteLegale
  }

  static async getEstablishment(siret: string) {
    const url = `${this.BASE_URL}/siret/${siret}`
    const response = await fetch(url, {
      headers: this.HEADERS,
    })

    const data: any = await response.json()

    return data.etablissement
  }

  static async enrichCustomer(siren: string) {
    const legalUnit = await this.getLegalUnit(siren)

    const periode = legalUnit.periodesUniteLegale?.find((p: any) => p.dateFin === null) ?? {}
    const name =
      periode.denominationUniteLegale ??
      `${legalUnit.prenom1UniteLegale ?? ''} ${periode.nomUniteLegale ?? ''}`.trim()

    const siret = siren + periode.nicSiegeUniteLegale

    const establishment = await this.getEstablishment(siret)

    return {
      name,
      siren: legalUnit.siren,
      siret: establishment.siret,
      naf: periode.activitePrincipaleUniteLegale,
      legalFormCode: periode.categorieJuridiqueUniteLegale,
      legalFormName: getLegalFormLabel(periode.categorieJuridiqueUniteLegale),
      createdAt: legalUnit.dateCreationUniteLegale,
      address:
        `${establishment.adresseEtablissement.numeroVoieEtablissement ?? ''} ${establishment.adresseEtablissement.libelleVoieEtablissement ?? ''}, ${establishment.adresseEtablissement.codePostalEtablissement} ${establishment.adresseEtablissement.libelleCommuneEtablissement}`.trim(),
    }
  }
}
