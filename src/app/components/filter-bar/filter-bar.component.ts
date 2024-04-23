import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  @Output() filtersChanged: EventEmitter<any> = new EventEmitter();
  @Output() clearFiltersEvent: EventEmitter<any> = new EventEmitter();
  
  @Input() types: string[] = [];
  @Input() currencies: string[] = [];
  @Input() isPrivate: boolean[] = [];

  @Input() selectedTypes: string[] = [];
  @Input() selectedCurrency: string[] = [];
  @Input() selectedIsPrivate: boolean | null = null;
  
 
  currentMessage: string;

  constructor() { }

  ngOnInit(): void {
    
  }
  
  applyFilters() {
    const filters = {
      selectedTypes: this.selectedTypes,
      selectedCurrency: this.selectedCurrency,
      selectedIsPrivate: this.selectedIsPrivate
    };
    this.filtersChanged.emit(filters); 
  }
  
  clearFilters(): void {
    this.clearFiltersEvent.emit();
  }
}
