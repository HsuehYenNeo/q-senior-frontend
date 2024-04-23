import { Injectable } from '@angular/core';
import { delay, Observable, of } from "rxjs";
import { Security } from "../models/security";
import { SECURITIES } from "../mocks/securities-mock";
import { SecuritiesFilter } from "../models/securitiesFilter";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  constructor() { }
  /**
   * Get Securities server request mock
   * */

  getSecurities(securityFilter?: SecuritiesFilter): Observable<Security[]> {
    const filteredSecurities = this.filterSecurities(securityFilter);

    const startIndex = securityFilter?.skip ?? 0; // page number
    const endIndex = startIndex + (securityFilter?.limit ?? 100); 
    const paginatedSecurities = filteredSecurities.slice(startIndex, endIndex);

    return of(paginatedSecurities).pipe(delay(1000));
  }

  getFilteredSecuritiesLength(securityFilter?: SecuritiesFilter): number {
    const filteredSecurities = this.filterSecurities(securityFilter);
    return filteredSecurities.length;
  }

  private filterSecurities(securityFilter: SecuritiesFilter) {
    if (!securityFilter) {
      return SECURITIES;
    }
    return SECURITIES.filter(s =>
      (!securityFilter.name || s.name.includes(securityFilter.name))
      && (!securityFilter.types || securityFilter.types.some(type => s.type === type))
      && (!securityFilter.currencies || securityFilter.currencies.some(currency => s.currency == currency))
      && (securityFilter.isPrivate === undefined || securityFilter.isPrivate === s.isPrivate)
    );
  }
}
