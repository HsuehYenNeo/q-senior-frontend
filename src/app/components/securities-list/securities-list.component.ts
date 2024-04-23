import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Security } from "../../models/security";
import { BehaviorSubject, Observable } from "rxjs";
import { indicate } from "../../utils";
import { SecurityService } from "../../services/security.service";
import { SecuritiesFilter } from "../../models/securitiesFilter";
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'securities-list',
  templateUrl: './securities-list.component.html',
  styleUrls: ['./securities-list.component.scss']
})
export class SecuritiesListComponent implements OnInit {
  @Output() filtersChanged: EventEmitter<any> = new EventEmitter(); 
  public displayedColumns: string[] = ["name", "type", "currency", "isPrivate"];

  public securities$: Observable<Security[]>;
  public loadingSecurities$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public filteredSecurities$: Observable<Security[]>;

  public selectedTypes: string[] = [];
  public selectedCurrency: string[] = [];
  public selectedIsPrivate: boolean | null = null;

  public types: string[] = [];
  public currencies: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private securityService: SecurityService) { }

  currentPage = 0;
  itemsPerPage = 10;
  filteredSecuritiesLength: number = 0;
  currentItemsLength: number = 0;

  ngOnInit(): void {
    // Load first page of securities
    this.loadSecurities({ skip: 0, limit: this.itemsPerPage});
    // Populate types and currencies dropdowns
    this.populateTypesAndCurrencies();
    // Load intial filters of empty object
    this.onFiltersChanged({});
  }

  loadSecurities(filterParams?: SecuritiesFilter): void {
    const filter = filterParams || { skip: 0, limit: this.itemsPerPage };
    this.filteredSecurities$ = this.securityService.getSecurities(filter)
      .pipe(indicate(this.loadingSecurities$));
  }
  
  populateTypesAndCurrencies(): void {
    // Fetch all securities to populate types and currencies dropdowns
    this.securityService.getSecurities().subscribe(securities => {
      this.types = Array.from(new Set(securities.map(security => security.type)));
      this.currencies = Array.from(new Set(securities.map(security => security.currency)));
  
      // After populating, set current filters
      this.onFiltersChanged({
        selectedTypes: this.selectedTypes,
        selectedCurrency: this.selectedCurrency,
        selectedIsPrivate: this.selectedIsPrivate
      });
    });
  }

  // Called when filters are changed
  onFiltersChanged(filters: { selectedTypes?: string[], selectedCurrency?: string[], selectedIsPrivate?: boolean | null }): void {
    this.currentPage = 0;
    this.selectedTypes = filters.selectedTypes?.length !==0 ? filters.selectedTypes : undefined;
    this.selectedCurrency = filters.selectedCurrency?.length !==0 ? filters.selectedCurrency : undefined;
    this.selectedIsPrivate = filters.selectedIsPrivate;
    const filter = {
      types: this.selectedTypes,
      currencies: this.selectedCurrency,
      isPrivate: this.selectedIsPrivate,
      skip: 0,
      limit: this.itemsPerPage
    };
    
    this.loadSecurities(filter);
    console.log('FilteredSecurities', this.filteredSecurities$);
    this.setPaginationInfo();

  }

  // Called when clicking on the paginator
  updateFilteredSecurities() {
    const filter = {
      types: this.selectedTypes,
      currencies: this.selectedCurrency,
      isPrivate: this.selectedIsPrivate,
      skip: this.currentPage * this.itemsPerPage, 
      limit: this.itemsPerPage
    };
   
    this.loadSecurities(filter);

    this.setPaginationInfo()
  }

  setPaginationInfo(): void {
    const lengthFilter = {
      types: this.selectedTypes,
      currencies: this.selectedCurrency,
      isPrivate: this.selectedIsPrivate
    };
    this.filteredSecuritiesLength = this.securityService.getFilteredSecuritiesLength(lengthFilter);

    const lastIndex = Math.min((this.currentPage + 1) * this.itemsPerPage, this.filteredSecuritiesLength);
    this.currentItemsLength = Math.min(this.filteredSecuritiesLength, lastIndex);
  }

  getNextSlice() {
    this.currentPage++;
    this.updateFilteredSecurities();
  }

  getPreviousSlice() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateFilteredSecurities();
    }
  }

  isFirstPage(): boolean {
    return (this.currentPage === 0);
  }

  isLastPage(): boolean {

    let totalPages = Math.ceil(this.filteredSecuritiesLength/this.itemsPerPage);
    if (this.currentPage === totalPages - 1) {
      return true;
    }
    return false; 
  }

  onClearFilters(): void {
    this.currentPage = 0;
    this.onFiltersChanged({});
  }
}
